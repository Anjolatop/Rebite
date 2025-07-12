const express = require('express');
const { auth } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, u.email, u.role, u.is_verified 
       FROM profiles p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.user_id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = result.rows[0];

    res.json({
      profile: {
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        avatarUrl: profile.avatar_url,
        role: profile.role,
        isVerified: profile.is_verified,
        nutritionGoals: profile.nutrition_goals,
        allergies: profile.allergies,
        dietPreferences: profile.diet_preferences,
        fitnessSyncSource: profile.fitness_sync_source,
        valueBars: profile.value_bars
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      nutritionGoals,
      allergies,
      dietPreferences,
      fitnessSyncSource
    } = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (firstName !== undefined) {
      updateFields.push(`first_name = $${paramCount}`);
      values.push(firstName);
      paramCount++;
    }

    if (lastName !== undefined) {
      updateFields.push(`last_name = $${paramCount}`);
      values.push(lastName);
      paramCount++;
    }

    if (phone !== undefined) {
      updateFields.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }

    if (nutritionGoals !== undefined) {
      updateFields.push(`nutrition_goals = $${paramCount}`);
      values.push(JSON.stringify(nutritionGoals));
      paramCount++;
    }

    if (allergies !== undefined) {
      updateFields.push(`allergies = $${paramCount}`);
      values.push(allergies);
      paramCount++;
    }

    if (dietPreferences !== undefined) {
      updateFields.push(`diet_preferences = $${paramCount}`);
      values.push(dietPreferences);
      paramCount++;
    }

    if (fitnessSyncSource !== undefined) {
      updateFields.push(`fitness_sync_source = $${paramCount}`);
      values.push(fitnessSyncSource);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.user.id);
    const query = `
      UPDATE profiles 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);

    res.json({
      message: 'Profile updated successfully',
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    // Get total orders
    const ordersResult = await db.query(
      'SELECT COUNT(*) as total_orders FROM orders WHERE user_id = $1 AND status != "cancelled"',
      [req.user.id]
    );

    // Get total spent
    const spentResult = await db.query(
      'SELECT COALESCE(SUM(total_amount_cents), 0) as total_spent FROM orders WHERE user_id = $1 AND status != "cancelled"',
      [req.user.id]
    );

    // Get total food rescued
    const rescuedResult = await db.query(
      `SELECT COALESCE(SUM(oi.quantity), 0) as food_rescued
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = $1 AND o.status != 'cancelled'`,
      [req.user.id]
    );

    // Get total points earned
    const pointsResult = await db.query(
      `SELECT COALESCE(SUM(points), 0) as total_points
       FROM points_transactions 
       WHERE user_id = $1 AND transaction_type IN ('earned', 'received')`,
      [req.user.id]
    );

    // Get current streak
    const streakResult = await db.query(
      `SELECT COUNT(*) as streak_days
       FROM (
         SELECT DISTINCT DATE(created_at) as order_date
         FROM orders
         WHERE user_id = $1 AND status != 'cancelled'
         ORDER BY DATE(created_at) DESC
       ) consecutive_dates
       WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'`,
      [req.user.id]
    );

    res.json({
      stats: {
        totalOrders: parseInt(ordersResult.rows[0].total_orders),
        totalSpentCents: parseInt(spentResult.rows[0].total_spent),
        foodRescued: parseInt(rescuedResult.rows[0].food_rescued),
        totalPoints: parseInt(pointsResult.rows[0].total_points),
        currentStreak: parseInt(streakResult.rows[0].streak_days)
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;