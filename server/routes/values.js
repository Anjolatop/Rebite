const express = require('express');
const { auth } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get user's value bars
router.get('/bars', auth, async (req, res) => {
  try {
    const profileResult = await db.query(
      'SELECT value_bars FROM profiles WHERE user_id = $1',
      [req.user.id]
    );

    const valueBars = profileResult.rows[0]?.value_bars || {};

    // Define available values with descriptions
    const availableValues = {
      Discipline: {
        name: 'Discipline',
        description: 'Making healthy food choices and sticking to nutrition goals',
        icon: '💪',
        color: '#4CAF50'
      },
      Mindfulness: {
        name: 'Mindfulness',
        description: 'Being conscious about food waste and sustainable choices',
        icon: '🧘',
        color: '#2196F3'
      },
      Prudence: {
        name: 'Prudence',
        description: 'Making smart financial decisions and finding good deals',
        icon: '💰',
        color: '#FF9800'
      },
      Empathy: {
        name: 'Empathy',
        description: 'Supporting local businesses and community',
        icon: '❤️',
        color: '#E91E63'
      },
      Creativity: {
        name: 'Creativity',
        description: 'Trying new recipes and cooking with rescued ingredients',
        icon: '🎨',
        color: '#9C27B0'
      }
    };

    // Initialize missing value bars
    const updatedValueBars = { ...valueBars };
    for (const [key, value] of Object.entries(availableValues)) {
      if (!updatedValueBars[key]) {
        updatedValueBars[key] = { level: 1, progress: 0 };
      }
    }

    // Update profile if new values were added
    if (Object.keys(updatedValueBars).length !== Object.keys(valueBars).length) {
      await db.query(
        'UPDATE profiles SET value_bars = $1 WHERE user_id = $2',
        [JSON.stringify(updatedValueBars), req.user.id]
      );
    }

    res.json({
      valueBars: updatedValueBars,
      availableValues
    });
  } catch (error) {
    console.error('Get value bars error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get value bar history
router.get('/history', auth, async (req, res) => {
  try {
    const { valueName, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT vbu.*, o.total_amount_cents, 
             STRING_AGG(l.title, ', ') as item_titles
      FROM value_bar_updates vbu
      LEFT JOIN orders o ON vbu.order_id = o.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN listings l ON oi.listing_id = l.id
      WHERE vbu.user_id = $1
    `;

    const params = [req.user.id];
    let paramCount = 2;

    if (valueName) {
      query += ` AND vbu.value_name = $${paramCount}`;
      params.push(valueName);
      paramCount++;
    }

    query += ` GROUP BY vbu.id, o.total_amount_cents
               ORDER BY vbu.created_at DESC 
               LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const result = await db.query(query, params);

    res.json({
      history: result.rows
    });
  } catch (error) {
    console.error('Get value history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get value bar statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { timeframe = 'all' } = req.query;

    let dateFilter = '';
    if (timeframe === 'week') {
      dateFilter = 'AND vbu.created_at >= NOW() - INTERVAL \'7 days\'';
    } else if (timeframe === 'month') {
      dateFilter = 'AND vbu.created_at >= NOW() - INTERVAL \'30 days\'';
    }

    const result = await db.query(
      `SELECT 
        vbu.value_name,
        COUNT(*) as updates_count,
        SUM(CASE WHEN vbu.new_level > vbu.old_level THEN 1 ELSE 0 END) as level_ups,
        SUM(vbu.points_earned) as total_points_earned,
        AVG(vbu.new_progress - vbu.old_progress) as avg_progress_change
       FROM value_bar_updates vbu
       WHERE vbu.user_id = $1 ${dateFilter}
       GROUP BY vbu.value_name
       ORDER BY total_points_earned DESC`,
      [req.user.id]
    );

    res.json({
      stats: result.rows
    });
  } catch (error) {
    console.error('Get value stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user goals
router.get('/goals', auth, async (req, res) => {
  try {
    const profileResult = await db.query(
      'SELECT nutrition_goals FROM profiles WHERE user_id = $1',
      [req.user.id]
    );

    const nutritionGoals = profileResult.rows[0]?.nutrition_goals || {};

    // Define available goals
    const availableGoals = {
      weight_loss: {
        name: 'Weight Loss',
        description: 'Lose weight through healthy eating',
        icon: '⚖️',
        target: 'pounds',
        valueBars: ['Discipline', 'Prudence']
      },
      muscle_gain: {
        name: 'Muscle Gain',
        description: 'Build muscle with high-protein foods',
        icon: '💪',
        target: 'pounds',
        valueBars: ['Discipline', 'Creativity']
      },
      diabetic_friendly: {
        name: 'Diabetic Friendly',
        description: 'Manage blood sugar with low-carb options',
        icon: '🩸',
        target: 'blood_sugar',
        valueBars: ['Discipline', 'Mindfulness']
      },
      heart_health: {
        name: 'Heart Health',
        description: 'Improve cardiovascular health',
        icon: '❤️',
        target: 'cholesterol',
        valueBars: ['Discipline', 'Mindfulness']
      },
      budget_friendly: {
        name: 'Budget Friendly',
        description: 'Save money on food expenses',
        icon: '💰',
        target: 'savings',
        valueBars: ['Prudence', 'Empathy']
      },
      sustainable: {
        name: 'Sustainable',
        description: 'Reduce environmental impact',
        icon: '🌱',
        target: 'carbon_footprint',
        valueBars: ['Mindfulness', 'Empathy']
      }
    };

    res.json({
      currentGoals: nutritionGoals,
      availableGoals
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user goals
router.put('/goals', auth, async (req, res) => {
  try {
    const { goals } = req.body;

    if (!goals || typeof goals !== 'object') {
      return res.status(400).json({ error: 'Valid goals object required' });
    }

    await db.query(
      'UPDATE profiles SET nutrition_goals = $1 WHERE user_id = $2',
      [JSON.stringify(goals), req.user.id]
    );

    res.json({
      message: 'Goals updated successfully',
      goals
    });
  } catch (error) {
    console.error('Update goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get value-based recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    // Get user's current value bars
    const profileResult = await db.query(
      'SELECT value_bars, nutrition_goals FROM profiles WHERE user_id = $1',
      [req.user.id]
    );

    const valueBars = profileResult.rows[0]?.value_bars || {};
    const nutritionGoals = profileResult.rows[0]?.nutrition_goals || {};

    // Find the value bar with lowest progress
    let lowestValue = null;
    let lowestProgress = 100;

    for (const [valueName, valueData] of Object.entries(valueBars)) {
      if (valueData.progress < lowestProgress) {
        lowestProgress = valueData.progress;
        lowestValue = valueName;
      }
    }

    // Generate recommendations based on lowest value
    const recommendations = [];

    if (lowestValue === 'Discipline') {
      recommendations.push({
        type: 'food',
        title: 'High-Protein Options',
        description: 'Try these protein-rich foods to boost your Discipline score',
        items: ['Grilled chicken breast', 'Greek yogurt', 'Quinoa bowl', 'Salmon fillet'],
        valueBar: 'Discipline',
        expectedImpact: '+5%'
      });
    }

    if (lowestValue === 'Mindfulness') {
      recommendations.push({
        type: 'food',
        title: 'Local & Organic',
        description: 'Choose local and organic options to improve your Mindfulness score',
        items: ['Local farm vegetables', 'Organic fruits', 'Seasonal produce', 'Farm-fresh eggs'],
        valueBar: 'Mindfulness',
        expectedImpact: '+3%'
      });
    }

    if (lowestValue === 'Prudence') {
      recommendations.push({
        type: 'food',
        title: 'Budget-Friendly Deals',
        description: 'Look for these discounted items to boost your Prudence score',
        items: ['Near-expiry produce', 'Bulk discounts', 'Flash sales', 'Clearance items'],
        valueBar: 'Prudence',
        expectedImpact: '+4%'
      });
    }

    // Add goal-based recommendations
    for (const [goalKey, goalData] of Object.entries(nutritionGoals)) {
      if (goalKey === 'weight_loss') {
        recommendations.push({
          type: 'goal',
          title: 'Weight Loss Support',
          description: 'Foods that align with your weight loss goal',
          items: ['Low-calorie vegetables', 'Lean proteins', 'Whole grains', 'Fiber-rich foods'],
          goal: 'weight_loss',
          valueBar: 'Discipline'
        });
      }

      if (goalKey === 'budget_friendly') {
        recommendations.push({
          type: 'goal',
          title: 'Budget Optimization',
          description: 'Tips to save money while eating well',
          items: ['Buy in bulk', 'Choose seasonal items', 'Look for discounts', 'Plan meals ahead'],
          goal: 'budget_friendly',
          valueBar: 'Prudence'
        });
      }
    }

    res.json({
      lowestValue,
      lowestProgress,
      recommendations: recommendations.slice(0, 3) // Return top 3 recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get value bar leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { valueName } = req.query;

    if (!valueName) {
      return res.status(400).json({ error: 'Value name is required' });
    }

    const result = await db.query(
      `SELECT 
        u.email,
        p.first_name,
        p.last_name,
        p.value_bars->$1->>'level' as level,
        p.value_bars->$1->>'progress' as progress,
        COUNT(vbu.id) as total_updates
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       LEFT JOIN value_bar_updates vbu ON u.id = vbu.user_id AND vbu.value_name = $1
       WHERE p.value_bars->$1 IS NOT NULL
       GROUP BY u.id, u.email, p.first_name, p.last_name, p.value_bars
       ORDER BY (p.value_bars->$1->>'level')::int DESC, (p.value_bars->$1->>'progress')::float DESC
       LIMIT 20`,
      [valueName]
    );

    res.json({
      valueName,
      leaderboard: result.rows.map((row, index) => ({
        rank: index + 1,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        level: parseInt(row.level),
        progress: parseFloat(row.progress),
        totalUpdates: parseInt(row.total_updates)
      }))
    });
  } catch (error) {
    console.error('Get value leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;