const express = require('express');
const { auth } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, deliveryAddress, deliveryInstructions } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Validate items and calculate total
    let totalAmountCents = 0;
    const validatedItems = [];

    for (const item of items) {
      const listingResult = await db.query(
        'SELECT * FROM listings WHERE id = $1 AND is_active = true AND expires_at > NOW()',
        [item.listingId]
      );

      if (listingResult.rows.length === 0) {
        return res.status(400).json({ error: `Listing ${item.listingId} not found or unavailable` });
      }

      const listing = listingResult.rows[0];

      if (listing.quantity_available < item.quantity) {
        return res.status(400).json({ error: `Insufficient quantity for ${listing.title}` });
      }

      const itemTotal = listing.price_cents * item.quantity;
      totalAmountCents += itemTotal;

      validatedItems.push({
        listingId: item.listingId,
        quantity: item.quantity,
        unitPriceCents: listing.price_cents,
        totalPriceCents: itemTotal,
        listing: listing
      });
    }

    // Create order
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, total_amount_cents, delivery_address, delivery_instructions)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, totalAmountCents, deliveryAddress, deliveryInstructions]
    );

    const order = orderResult.rows[0];

    // Create order items and update listing quantities
    for (const item of validatedItems) {
      await db.query(
        `INSERT INTO order_items (order_id, listing_id, quantity, unit_price_cents, total_price_cents)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.listingId, item.quantity, item.unitPriceCents, item.totalPriceCents]
      );

      // Update listing quantity
      await db.query(
        `UPDATE listings 
         SET quantity_available = quantity_available - $1, quantity_sold = quantity_sold + $1
         WHERE id = $2`,
        [item.quantity, item.listingId]
      );
    }

    // Award base points for rescue
    await db.query(
      `INSERT INTO points_transactions (user_id, order_id, points, transaction_type, description)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.id, order.id, 10, 'earned', 'Rescue bonus']
    );

    // Calculate value bar impacts
    await calculateValueBarImpacts(order.id, req.user.id, validatedItems);

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        ...order,
        items: validatedItems
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user orders
router.get('/me', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT o.*, 
             COUNT(oi.id) as item_count,
             STRING_AGG(DISTINCT l.title, ', ') as item_titles
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN listings l ON oi.listing_id = l.id
      WHERE o.user_id = $1
    `;

    const params = [req.user.id];
    let paramCount = 2;

    if (status) {
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const result = await db.query(query, params);

    res.json({
      orders: result.rows
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get order details
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get order
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Get order items with listing details
    const itemsResult = await db.query(
      `SELECT oi.*, l.title, l.description, l.image_urls, l.tags, l.nutrition
       FROM order_items oi
       JOIN listings l ON oi.listing_id = l.id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({
      order: {
        ...order,
        items: itemsResult.rows.map(item => ({
          ...item,
          nutrition: item.nutrition || {},
          imageUrls: item.image_urls || [],
          tags: item.tags || []
        }))
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order status (for vendors)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if user is vendor for this order
    const orderResult = await db.query(
      `SELECT o.* FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN listings l ON oi.listing_id = l.id
       JOIN vendors v ON l.vendor_id = v.id
       WHERE o.id = $1 AND v.user_id = $2`,
      [id, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or access denied' });
    }

    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({
      message: 'Order status updated successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Checkout with recipe suggestions
router.post('/:id/checkout', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    // Get order
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    if (order.payment_status === 'paid') {
      return res.status(400).json({ error: 'Order already paid' });
    }

    // Get order items for recipe suggestions
    const itemsResult = await db.query(
      `SELECT l.title, l.tags, l.nutrition
       FROM order_items oi
       JOIN listings l ON oi.listing_id = l.id
       WHERE oi.order_id = $1`,
      [id]
    );

    const ingredients = itemsResult.rows.map(item => item.title.toLowerCase());
    const tags = itemsResult.rows.flatMap(item => item.tags || []);

    // Generate recipe suggestions
    const recipeSuggestions = await generateRecipeSuggestions(ingredients, tags);

    // Update payment status (in real app, integrate with Stripe)
    await db.query(
      'UPDATE orders SET payment_status = $1, payment_method = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      ['paid', paymentMethod, id]
    );

    res.json({
      message: 'Checkout successful',
      order: order,
      recipeSuggestions
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to calculate value bar impacts
async function calculateValueBarImpacts(orderId, userId, items) {
  try {
    // Get user's current value bars
    const profileResult = await db.query(
      'SELECT value_bars FROM profiles WHERE user_id = $1',
      [userId]
    );

    const currentValueBars = profileResult.rows[0]?.value_bars || {};
    const updatedValueBars = { ...currentValueBars };

    // Define value scoring formulas
    const valueFormulas = {
      Discipline: (nutrition, tags) => {
        let score = 0;
        if (nutrition.calories) score -= 0.01 * nutrition.calories;
        if (nutrition.sugar) score -= 0.05 * nutrition.sugar;
        if (nutrition.protein) score += 0.03 * nutrition.protein;
        if (tags.includes('fried')) score -= 0.1;
        return Math.max(Math.min(score * 0.75, 10), -10);
      },
      Mindfulness: (nutrition, tags, rescueScore) => {
        let score = 0;
        if (rescueScore > 50) score += 5;
        if (tags.includes('local')) score += 3;
        if (tags.includes('organic')) score += 2;
        return Math.max(Math.min(score * 0.75, 10), -10);
      },
      Prudence: (priceCents, originalPriceCents) => {
        let score = 0;
        if (originalPriceCents && originalPriceCents > priceCents) {
          const discount = ((originalPriceCents - priceCents) / originalPriceCents) * 100;
          score += discount * 0.2;
        }
        return Math.max(Math.min(score * 0.75, 10), -10);
      }
    };

    for (const item of items) {
      const listing = item.listing;
      const nutrition = listing.nutrition || {};
      const tags = listing.tags || [];
      const rescueScore = listing.rescue_score || 0;

      for (const [valueName, formula] of Object.entries(valueFormulas)) {
        const impact = formula(nutrition, tags, rescueScore, listing.price_cents, listing.original_price_cents);
        
        if (!updatedValueBars[valueName]) {
          updatedValueBars[valueName] = { level: 1, progress: 0 };
        }

        const currentBar = updatedValueBars[valueName];
        const newProgress = Math.max(0, Math.min(100, currentBar.progress + impact));

        // Check for level up
        let levelUp = false;
        if (newProgress >= 100) {
          currentBar.level += 1;
          currentBar.progress = newProgress - 100;
          levelUp = true;
        } else {
          currentBar.progress = newProgress;
        }

        // Record the update
        await db.query(
          `INSERT INTO value_bar_updates (
            user_id, order_id, value_name, old_level, new_level, 
            old_progress, new_progress, points_earned
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            userId, orderId, valueName, 
            currentBar.level - (levelUp ? 1 : 0), currentBar.level,
            currentBar.progress - impact, currentBar.progress,
            levelUp ? 50 : Math.max(0, impact)
          ]
        );

        // Award points for level up
        if (levelUp) {
          await db.query(
            `INSERT INTO points_transactions (user_id, order_id, points, transaction_type, description)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, orderId, 50, 'earned', `${valueName} level up!`]
          );
        }
      }
    }

    // Update user's value bars
    await db.query(
      'UPDATE profiles SET value_bars = $1 WHERE user_id = $2',
      [JSON.stringify(updatedValueBars), userId]
    );

  } catch (error) {
    console.error('Calculate value bar impacts error:', error);
  }
}

// Helper function to generate recipe suggestions
async function generateRecipeSuggestions(ingredients, tags) {
  try {
    // In a real implementation, this would call an external recipe API
    // For now, return mock suggestions based on ingredients
    const suggestions = [];

    if (ingredients.some(ing => ing.includes('tomato') || ing.includes('pasta'))) {
      suggestions.push({
        title: 'Quick Tomato Pasta',
        description: 'Simple and delicious pasta with fresh tomatoes',
        prepTime: 15,
        cookTime: 20,
        servings: 2,
        ingredientsAvailable: ingredients.filter(ing => ing.includes('tomato') || ing.includes('pasta')),
        ingredientsMissing: ['olive oil', 'garlic', 'basil'],
        missingCostCents: 250,
        confidenceScore: 0.85
      });
    }

    if (ingredients.some(ing => ing.includes('bread') || ing.includes('cheese'))) {
      suggestions.push({
        title: 'Grilled Cheese Deluxe',
        description: 'Classic comfort food with a twist',
        prepTime: 5,
        cookTime: 10,
        servings: 1,
        ingredientsAvailable: ingredients.filter(ing => ing.includes('bread') || ing.includes('cheese')),
        ingredientsMissing: ['butter'],
        missingCostCents: 100,
        confidenceScore: 0.90
      });
    }

    return suggestions.slice(0, 2); // Return top 2 suggestions
  } catch (error) {
    console.error('Generate recipe suggestions error:', error);
    return [];
  }
}

module.exports = router;