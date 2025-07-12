const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'consumer' } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userResult = await db.query(
      'INSERT INTO users (id, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
      [uuidv4(), email, passwordHash, role]
    );

    const user = userResult.rows[0];

    // Create profile
    await db.query(
      'INSERT INTO profiles (user_id, first_name, last_name) VALUES ($1, $2, $3)',
      [user.id, firstName, lastName]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const userResult = await db.query(
      'SELECT id, email, password_hash, role, is_verified FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const profileResult = await db.query(
      `SELECT p.*, u.email, u.role, u.is_verified 
       FROM profiles p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.user_id = $1`,
      [req.user.id]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = profileResult.rows[0];

    // Get vendor info if user is a vendor
    let vendor = null;
    if (req.user.role === 'vendor') {
      const vendorResult = await db.query(
        'SELECT * FROM vendors WHERE user_id = $1',
        [req.user.id]
      );
      if (vendorResult.rows.length > 0) {
        vendor = vendorResult.rows[0];
      }
    }

    res.json({
      user: {
        id: profile.user_id,
        email: profile.email,
        role: profile.role,
        isVerified: profile.is_verified
      },
      profile: {
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        avatarUrl: profile.avatar_url,
        nutritionGoals: profile.nutrition_goals,
        allergies: profile.allergies,
        dietPreferences: profile.diet_preferences,
        fitnessSyncSource: profile.fitness_sync_source,
        valueBars: profile.value_bars
      },
      vendor
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

// Refresh token
router.post('/refresh', auth, async (req, res) => {
  try {
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Token refreshed',
      token
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;