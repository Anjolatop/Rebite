const express = require('express');
const { auth } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get user points balance and transactions
router.get('/balance', auth, async (req, res) => {
  try {
    // Calculate total points balance
    const balanceResult = await db.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN transaction_type IN ('earned', 'received') THEN points ELSE 0 END), 0) as earned,
        COALESCE(SUM(CASE WHEN transaction_type IN ('spent', 'gifted', 'donated') THEN points ELSE 0 END), 0) as spent
       FROM points_transactions 
       WHERE user_id = $1`,
      [req.user.id]
    );

    const earned = parseInt(balanceResult.rows[0].earned);
    const spent = parseInt(balanceResult.rows[0].spent);
    const balance = earned - spent;

    // Get recent transactions
    const transactionsResult = await db.query(
      `SELECT * FROM points_transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [req.user.id]
    );

    res.json({
      balance,
      earned,
      spent,
      recentTransactions: transactionsResult.rows
    });
  } catch (error) {
    console.error('Get points balance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all points transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM points_transactions WHERE user_id = $1';
    const params = [req.user.id];
    let paramCount = 2;

    if (type) {
      query += ` AND transaction_type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const result = await db.query(query, params);

    res.json({
      transactions: result.rows
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Gift points to another user
router.post('/gift', auth, async (req, res) => {
  try {
    const { recipientEmail, points, message } = req.body;

    if (!recipientEmail || !points || points <= 0) {
      return res.status(400).json({ error: 'Valid recipient email and positive points amount required' });
    }

    // Check if user has enough points
    const balanceResult = await db.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN transaction_type IN ('earned', 'received') THEN points ELSE 0 END), 0) as earned,
        COALESCE(SUM(CASE WHEN transaction_type IN ('spent', 'gifted', 'donated') THEN points ELSE 0 END), 0) as spent
       FROM points_transactions 
       WHERE user_id = $1`,
      [req.user.id]
    );

    const balance = parseInt(balanceResult.rows[0].earned) - parseInt(balanceResult.rows[0].spent);

    if (balance < points) {
      return res.status(400).json({ error: 'Insufficient points balance' });
    }

    // Find recipient user
    const recipientResult = await db.query(
      'SELECT id, email FROM users WHERE email = $1',
      [recipientEmail]
    );

    if (recipientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    const recipient = recipientResult.rows[0];

    if (recipient.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot gift points to yourself' });
    }

    // Create gift transaction for sender
    await db.query(
      `INSERT INTO points_transactions (user_id, points, transaction_type, description)
       VALUES ($1, $2, $3, $4)`,
      [req.user.id, points, 'gifted', `Gifted to ${recipientEmail}: ${message || 'No message'}`]
    );

    // Create received transaction for recipient
    await db.query(
      `INSERT INTO points_transactions (user_id, points, transaction_type, description)
       VALUES ($1, $2, $3, $4)`,
      [recipient.id, points, 'received', `Received from ${req.user.email}: ${message || 'No message'}`]
    );

    res.json({
      message: 'Points gifted successfully',
      giftedPoints: points,
      recipientEmail
    });
  } catch (error) {
    console.error('Gift points error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Donate points to food bank
router.post('/donate', auth, async (req, res) => {
  try {
    const { points, organization = 'Local Food Bank' } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({ error: 'Valid positive points amount required' });
    }

    // Check if user has enough points
    const balanceResult = await db.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN transaction_type IN ('earned', 'received') THEN points ELSE 0 END), 0) as earned,
        COALESCE(SUM(CASE WHEN transaction_type IN ('spent', 'gifted', 'donated') THEN points ELSE 0 END), 0) as spent
       FROM points_transactions 
       WHERE user_id = $1`,
      [req.user.id]
    );

    const balance = parseInt(balanceResult.rows[0].earned) - parseInt(balanceResult.rows[0].spent);

    if (balance < points) {
      return res.status(400).json({ error: 'Insufficient points balance' });
    }

    // Create donation transaction
    await db.query(
      `INSERT INTO points_transactions (user_id, points, transaction_type, description)
       VALUES ($1, $2, $3, $4)`,
      [req.user.id, points, 'donated', `Donated to ${organization}`]
    );

    res.json({
      message: 'Points donated successfully',
      donatedPoints: points,
      organization
    });
  } catch (error) {
    console.error('Donate points error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { timeframe = 'all' } = req.query;

    let dateFilter = '';
    if (timeframe === 'week') {
      dateFilter = 'AND created_at >= NOW() - INTERVAL \'7 days\'';
    } else if (timeframe === 'month') {
      dateFilter = 'AND created_at >= NOW() - INTERVAL \'30 days\'';
    }

    const result = await db.query(
      `SELECT 
        u.email,
        p.first_name,
        p.last_name,
        COALESCE(SUM(CASE WHEN pt.transaction_type IN ('earned', 'received') THEN pt.points ELSE 0 END), 0) as total_earned,
        COALESCE(SUM(CASE WHEN pt.transaction_type IN ('spent', 'gifted', 'donated') THEN pt.points ELSE 0 END), 0) as total_spent,
        COALESCE(SUM(CASE WHEN pt.transaction_type IN ('earned', 'received') THEN pt.points ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN pt.transaction_type IN ('spent', 'gifted', 'donated') THEN pt.points ELSE 0 END), 0) as balance
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       LEFT JOIN points_transactions pt ON u.id = pt.user_id ${dateFilter}
       GROUP BY u.id, u.email, p.first_name, p.last_name
       HAVING COALESCE(SUM(CASE WHEN pt.transaction_type IN ('earned', 'received') THEN pt.points ELSE 0 END), 0) - 
              COALESCE(SUM(CASE WHEN pt.transaction_type IN ('spent', 'gifted', 'donated') THEN pt.points ELSE 0 END), 0) > 0
       ORDER BY balance DESC
       LIMIT 20`,
      []
    );

    res.json({
      leaderboard: result.rows.map((row, index) => ({
        rank: index + 1,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        totalEarned: parseInt(row.total_earned),
        totalSpent: parseInt(row.total_spent),
        balance: parseInt(row.balance)
      }))
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user streaks and achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    // Calculate current streak
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

    const currentStreak = parseInt(streakResult.rows[0].streak_days);

    // Get total orders
    const ordersResult = await db.query(
      'SELECT COUNT(*) as total_orders FROM orders WHERE user_id = $1 AND status != "cancelled"',
      [req.user.id]
    );

    const totalOrders = parseInt(ordersResult.rows[0].total_orders);

    // Get total food rescued
    const rescuedResult = await db.query(
      `SELECT COALESCE(SUM(oi.quantity), 0) as food_rescued
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = $1 AND o.status != 'cancelled'`,
      [req.user.id]
    );

    const foodRescued = parseInt(rescuedResult.rows[0].food_rescued);

    // Calculate achievements
    const achievements = [];

    if (currentStreak >= 7) {
      achievements.push({
        id: 'week_streak',
        name: 'Week Warrior',
        description: 'Ordered for 7 consecutive days',
        icon: '🔥',
        unlocked: true
      });
    }

    if (totalOrders >= 10) {
      achievements.push({
        id: 'order_master',
        name: 'Order Master',
        description: 'Placed 10 orders',
        icon: '📦',
        unlocked: true
      });
    }

    if (foodRescued >= 50) {
      achievements.push({
        id: 'food_hero',
        name: 'Food Hero',
        description: 'Rescued 50 food items',
        icon: '🦸‍♂️',
        unlocked: true
      });
    }

    res.json({
      currentStreak,
      totalOrders,
      foodRescued,
      achievements
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;