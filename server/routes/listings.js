const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Create new listing
router.post('/', auth, requireRole(['vendor']), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      nutrition,
      priceCents,
      originalPriceCents,
      quantityAvailable,
      expiresAt,
      imageUrls,
      tags
    } = req.body;

    if (!title || !priceCents || !expiresAt) {
      return res.status(400).json({ error: 'Title, price, and expiry date are required' });
    }

    // Get vendor ID
    const vendorResult = await db.query(
      'SELECT id FROM vendors WHERE user_id = $1',
      [req.user.id]
    );

    if (vendorResult.rows.length === 0) {
      return res.status(400).json({ error: 'Vendor profile not found' });
    }

    const vendorId = vendorResult.rows[0].id;

    // Calculate rescue score based on expiry time and discount
    const now = new Date();
    const expiryDate = new Date(expiresAt);
    const hoursUntilExpiry = (expiryDate - now) / (1000 * 60 * 60);
    
    let rescueScore = 0;
    if (originalPriceCents && originalPriceCents > priceCents) {
      const discountPercent = ((originalPriceCents - priceCents) / originalPriceCents) * 100;
      rescueScore += Math.min(discountPercent * 2, 50); // Max 50 points for discount
    }
    
    if (hoursUntilExpiry <= 24) {
      rescueScore += 30; // High urgency
    } else if (hoursUntilExpiry <= 48) {
      rescueScore += 20; // Medium urgency
    } else if (hoursUntilExpiry <= 72) {
      rescueScore += 10; // Low urgency
    }

    rescueScore = Math.min(rescueScore, 100);

    const result = await db.query(
      `INSERT INTO listings (
        vendor_id, title, description, category, nutrition, price_cents, 
        original_price_cents, quantity_available, expires_at, rescue_score, 
        image_urls, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        vendorId, title, description, category, JSON.stringify(nutrition || {}),
        priceCents, originalPriceCents, quantityAvailable || 1, expiresAt,
        rescueScore, imageUrls || [], tags || []
      ]
    );

    res.status(201).json({
      message: 'Listing created successfully',
      listing: result.rows[0]
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get personalized feed
router.get('/feed', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, latitude, longitude } = req.query;
    const offset = (page - 1) * limit;

    // Get user profile for personalization
    const profileResult = await db.query(
      'SELECT nutrition_goals, allergies, diet_preferences FROM profiles WHERE user_id = $1',
      [req.user.id]
    );

    const profile = profileResult.rows[0] || {};
    const nutritionGoals = profile.nutrition_goals || {};
    const allergies = profile.allergies || [];
    const dietPreferences = profile.diet_preferences || [];

    let query = `
      SELECT l.*, v.display_name as vendor_name, v.vendor_type, v.latitude, v.longitude
      FROM listings l
      JOIN vendors v ON l.vendor_id = v.id
      WHERE l.is_active = true AND l.expires_at > NOW()
    `;

    const params = [];
    let paramCount = 1;

    // Filter by allergies
    if (allergies.length > 0) {
      const allergyConditions = allergies.map(() => `NOT (l.tags && $${paramCount})`).join(' AND ');
      query += ` AND (${allergyConditions})`;
      allergies.forEach(allergy => {
        params.push([allergy]);
        paramCount++;
      });
    }

    // Filter by diet preferences
    if (dietPreferences.length > 0) {
      const dietConditions = dietPreferences.map(() => `l.tags && $${paramCount}`).join(' OR ');
      query += ` AND (${dietConditions})`;
      dietPreferences.forEach(diet => {
        params.push([diet]);
        paramCount++;
      });
    }

    // Add distance calculation if coordinates provided
    if (latitude && longitude) {
      query = `
        SELECT l.*, v.display_name as vendor_name, v.vendor_type, v.latitude, v.longitude,
               ST_Distance(
                 ST_SetSRID(ST_MakePoint($${paramCount}, $${paramCount + 1}), 4326),
                 ST_SetSRID(ST_MakePoint(v.longitude, v.latitude), 4326)
               ) as distance_km
        FROM listings l
        JOIN vendors v ON l.vendor_id = v.id
        WHERE l.is_active = true AND l.expires_at > NOW()
      `;
      params.push(parseFloat(longitude), parseFloat(latitude));
      paramCount += 2;

      // Re-add filters
      if (allergies.length > 0) {
        const allergyConditions = allergies.map(() => `NOT (l.tags && $${paramCount})`).join(' AND ');
        query += ` AND (${allergyConditions})`;
        allergies.forEach(allergy => {
          params.push([allergy]);
          paramCount++;
        });
      }

      if (dietPreferences.length > 0) {
        const dietConditions = dietPreferences.map(() => `l.tags && $${paramCount}`).join(' OR ');
        query += ` AND (${dietConditions})`;
        dietPreferences.forEach(diet => {
          params.push([diet]);
          paramCount++;
        });
      }
    }

    // Order by rescue score and distance
    if (latitude && longitude) {
      query += ` ORDER BY l.rescue_score DESC, distance_km ASC`;
    } else {
      query += ` ORDER BY l.rescue_score DESC, l.created_at DESC`;
    }

    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const result = await db.query(query, params);

    // Calculate total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM listings l
      JOIN vendors v ON l.vendor_id = v.id
      WHERE l.is_active = true AND l.expires_at > NOW()
    `;
    const countResult = await db.query(countQuery);

    res.json({
      listings: result.rows.map(listing => ({
        ...listing,
        nutrition: listing.nutrition || {},
        imageUrls: listing.image_urls || [],
        tags: listing.tags || [],
        distance_km: listing.distance_km ? parseFloat(listing.distance_km) : null
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search listings
router.get('/search', auth, async (req, res) => {
  try {
    const { 
      q, category, vendorType, minPrice, maxPrice, 
      minRescueScore, maxDistance, latitude, longitude,
      page = 1, limit = 20 
    } = req.query;
    
    const offset = (page - 1) * limit;

    let query = `
      SELECT l.*, v.display_name as vendor_name, v.vendor_type, v.latitude, v.longitude
      FROM listings l
      JOIN vendors v ON l.vendor_id = v.id
      WHERE l.is_active = true AND l.expires_at > NOW()
    `;

    const params = [];
    let paramCount = 1;

    // Text search
    if (q) {
      query += ` AND (l.title ILIKE $${paramCount} OR l.description ILIKE $${paramCount} OR l.tags && $${paramCount + 1})`;
      params.push(`%${q}%`, [q]);
      paramCount += 2;
    }

    // Category filter
    if (category) {
      query += ` AND l.category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    // Vendor type filter
    if (vendorType) {
      query += ` AND v.vendor_type = $${paramCount}`;
      params.push(vendorType);
      paramCount++;
    }

    // Price range
    if (minPrice) {
      query += ` AND l.price_cents >= $${paramCount}`;
      params.push(parseInt(minPrice));
      paramCount++;
    }

    if (maxPrice) {
      query += ` AND l.price_cents <= $${paramCount}`;
      params.push(parseInt(maxPrice));
      paramCount++;
    }

    // Rescue score filter
    if (minRescueScore) {
      query += ` AND l.rescue_score >= $${paramCount}`;
      params.push(parseInt(minRescueScore));
      paramCount++;
    }

    // Distance filter
    if (maxDistance && latitude && longitude) {
      query = `
        SELECT l.*, v.display_name as vendor_name, v.vendor_type, v.latitude, v.longitude,
               ST_Distance(
                 ST_SetSRID(ST_MakePoint($${paramCount}, $${paramCount + 1}), 4326),
                 ST_SetSRID(ST_MakePoint(v.longitude, v.latitude), 4326)
               ) as distance_km
        FROM listings l
        JOIN vendors v ON l.vendor_id = v.id
        WHERE l.is_active = true AND l.expires_at > NOW()
      `;
      params.push(parseFloat(longitude), parseFloat(latitude));
      paramCount += 2;

      // Re-add other filters
      if (q) {
        query += ` AND (l.title ILIKE $${paramCount} OR l.description ILIKE $${paramCount} OR l.tags && $${paramCount + 1})`;
        params.push(`%${q}%`, [q]);
        paramCount += 2;
      }

      if (category) {
        query += ` AND l.category = $${paramCount}`;
        params.push(category);
        paramCount++;
      }

      if (vendorType) {
        query += ` AND v.vendor_type = $${paramCount}`;
        params.push(vendorType);
        paramCount++;
      }

      if (minPrice) {
        query += ` AND l.price_cents >= $${paramCount}`;
        params.push(parseInt(minPrice));
        paramCount++;
      }

      if (maxPrice) {
        query += ` AND l.price_cents <= $${paramCount}`;
        params.push(parseInt(maxPrice));
        paramCount++;
      }

      if (minRescueScore) {
        query += ` AND l.rescue_score >= $${paramCount}`;
        params.push(parseInt(minRescueScore));
        paramCount++;
      }

      query += ` AND ST_DWithin(
        ST_SetSRID(ST_MakePoint($${paramCount - 2}, $${paramCount - 1}), 4326),
        ST_SetSRID(ST_MakePoint(v.longitude, v.latitude), 4326),
        $${paramCount} * 1000
      )`;
      params.push(parseFloat(maxDistance));
      paramCount++;
    }

    query += ` ORDER BY l.rescue_score DESC, l.created_at DESC`;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const result = await db.query(query, params);

    res.json({
      listings: result.rows.map(listing => ({
        ...listing,
        nutrition: listing.nutrition || {},
        imageUrls: listing.image_urls || [],
        tags: listing.tags || [],
        distance_km: listing.distance_km ? parseFloat(listing.distance_km) : null
      }))
    });
  } catch (error) {
    console.error('Search listings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get listing by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT l.*, v.display_name as vendor_name, v.vendor_type, v.bio as vendor_bio,
              v.latitude, v.longitude, v.phone as vendor_phone
       FROM listings l
       JOIN vendors v ON l.vendor_id = v.id
       WHERE l.id = $1 AND l.is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listing = result.rows[0];

    res.json({
      listing: {
        ...listing,
        nutrition: listing.nutrition || {},
        imageUrls: listing.image_urls || [],
        tags: listing.tags || []
      }
    });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update listing
router.put('/:id', auth, requireRole(['vendor']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      nutrition,
      priceCents,
      originalPriceCents,
      quantityAvailable,
      expiresAt,
      imageUrls,
      tags,
      isActive
    } = req.body;

    // Verify ownership
    const vendorResult = await db.query(
      'SELECT id FROM vendors WHERE user_id = $1',
      [req.user.id]
    );

    if (vendorResult.rows.length === 0) {
      return res.status(400).json({ error: 'Vendor profile not found' });
    }

    const vendorId = vendorResult.rows[0].id;

    const ownershipResult = await db.query(
      'SELECT id FROM listings WHERE id = $1 AND vendor_id = $2',
      [id, vendorId]
    );

    if (ownershipResult.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found or access denied' });
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (category !== undefined) {
      updateFields.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }

    if (nutrition !== undefined) {
      updateFields.push(`nutrition = $${paramCount}`);
      values.push(JSON.stringify(nutrition));
      paramCount++;
    }

    if (priceCents !== undefined) {
      updateFields.push(`price_cents = $${paramCount}`);
      values.push(priceCents);
      paramCount++;
    }

    if (originalPriceCents !== undefined) {
      updateFields.push(`original_price_cents = $${paramCount}`);
      values.push(originalPriceCents);
      paramCount++;
    }

    if (quantityAvailable !== undefined) {
      updateFields.push(`quantity_available = $${paramCount}`);
      values.push(quantityAvailable);
      paramCount++;
    }

    if (expiresAt !== undefined) {
      updateFields.push(`expires_at = $${paramCount}`);
      values.push(expiresAt);
      paramCount++;
    }

    if (imageUrls !== undefined) {
      updateFields.push(`image_urls = $${paramCount}`);
      values.push(imageUrls);
      paramCount++;
    }

    if (tags !== undefined) {
      updateFields.push(`tags = $${paramCount}`);
      values.push(tags);
      paramCount++;
    }

    if (isActive !== undefined) {
      updateFields.push(`is_active = $${paramCount}`);
      values.push(isActive);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const query = `
      UPDATE listings 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);

    res.json({
      message: 'Listing updated successfully',
      listing: result.rows[0]
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get vendor's listings
router.get('/vendor/me', auth, requireRole(['vendor']), async (req, res) => {
  try {
    const vendorResult = await db.query(
      'SELECT id FROM vendors WHERE user_id = $1',
      [req.user.id]
    );

    if (vendorResult.rows.length === 0) {
      return res.status(400).json({ error: 'Vendor profile not found' });
    }

    const vendorId = vendorResult.rows[0].id;

    const result = await db.query(
      'SELECT * FROM listings WHERE vendor_id = $1 ORDER BY created_at DESC',
      [vendorId]
    );

    res.json({
      listings: result.rows.map(listing => ({
        ...listing,
        nutrition: listing.nutrition || {},
        imageUrls: listing.image_urls || [],
        tags: listing.tags || []
      }))
    });
  } catch (error) {
    console.error('Get vendor listings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;