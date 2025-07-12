const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Create vendor profile
router.post('/', auth, requireRole(['vendor']), async (req, res) => {
  try {
    const {
      vendorType,
      displayName,
      bio,
      address,
      latitude,
      longitude,
      phone,
      website
    } = req.body;

    if (!vendorType || !displayName) {
      return res.status(400).json({ error: 'Vendor type and display name are required' });
    }

    if (!['farmer', 'restaurant'].includes(vendorType)) {
      return res.status(400).json({ error: 'Invalid vendor type' });
    }

    // Check if vendor profile already exists
    const existingVendor = await db.query(
      'SELECT id FROM vendors WHERE user_id = $1',
      [req.user.id]
    );

    if (existingVendor.rows.length > 0) {
      return res.status(400).json({ error: 'Vendor profile already exists' });
    }

    const result = await db.query(
      `INSERT INTO vendors (user_id, vendor_type, display_name, bio, address, latitude, longitude, phone, website)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [req.user.id, vendorType, displayName, bio, address, latitude, longitude, phone, website]
    );

    res.status(201).json({
      message: 'Vendor profile created successfully',
      vendor: result.rows[0]
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get vendor profile
router.get('/me', auth, requireRole(['vendor']), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM vendors WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    res.json({ vendor: result.rows[0] });
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update vendor profile
router.put('/me', auth, requireRole(['vendor']), async (req, res) => {
  try {
    const {
      displayName,
      bio,
      address,
      latitude,
      longitude,
      phone,
      website
    } = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (displayName !== undefined) {
      updateFields.push(`display_name = $${paramCount}`);
      values.push(displayName);
      paramCount++;
    }

    if (bio !== undefined) {
      updateFields.push(`bio = $${paramCount}`);
      values.push(bio);
      paramCount++;
    }

    if (address !== undefined) {
      updateFields.push(`address = $${paramCount}`);
      values.push(address);
      paramCount++;
    }

    if (latitude !== undefined) {
      updateFields.push(`latitude = $${paramCount}`);
      values.push(latitude);
      paramCount++;
    }

    if (longitude !== undefined) {
      updateFields.push(`longitude = $${paramCount}`);
      values.push(longitude);
      paramCount++;
    }

    if (phone !== undefined) {
      updateFields.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }

    if (website !== undefined) {
      updateFields.push(`website = $${paramCount}`);
      values.push(website);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.user.id);
    const query = `
      UPDATE vendors 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    res.json({
      message: 'Vendor profile updated successfully',
      vendor: result.rows[0]
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get vendor analytics
router.get('/analytics', auth, requireRole(['vendor']), async (req, res) => {
  try {
    const vendorResult = await db.query(
      'SELECT id FROM vendors WHERE user_id = $1',
      [req.user.id]
    );

    if (vendorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const vendorId = vendorResult.rows[0].id;

    // Get total listings
    const listingsResult = await db.query(
      'SELECT COUNT(*) as total_listings FROM listings WHERE vendor_id = $1',
      [vendorId]
    );

    // Get active listings
    const activeListingsResult = await db.query(
      'SELECT COUNT(*) as active_listings FROM listings WHERE vendor_id = $1 AND is_active = true AND expires_at > NOW()',
      [vendorId]
    );

    // Get total sales
    const salesResult = await db.query(
      `SELECT COALESCE(SUM(oi.total_price_cents), 0) as total_sales_cents
       FROM order_items oi
       JOIN listings l ON oi.listing_id = l.id
       WHERE l.vendor_id = $1`,
      [vendorId]
    );

    // Get total orders
    const ordersResult = await db.query(
      `SELECT COUNT(DISTINCT o.id) as total_orders
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN listings l ON oi.listing_id = l.id
       WHERE l.vendor_id = $1`,
      [vendorId]
    );

    // Get food rescued (total quantity sold)
    const rescuedResult = await db.query(
      `SELECT COALESCE(SUM(oi.quantity), 0) as food_rescued
       FROM order_items oi
       JOIN listings l ON oi.listing_id = l.id
       WHERE l.vendor_id = $1`,
      [vendorId]
    );

    // Get average time to sell
    const avgTimeResult = await db.query(
      `SELECT AVG(EXTRACT(EPOCH FROM (o.created_at - l.created_at))/3600) as avg_hours_to_sell
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN listings l ON oi.listing_id = l.id
       WHERE l.vendor_id = $1`,
      [vendorId]
    );

    res.json({
      analytics: {
        totalListings: parseInt(listingsResult.rows[0].total_listings),
        activeListings: parseInt(activeListingsResult.rows[0].active_listings),
        totalSalesCents: parseInt(salesResult.rows[0].total_sales_cents),
        totalOrders: parseInt(ordersResult.rows[0].total_orders),
        foodRescued: parseInt(rescuedResult.rows[0].food_rescued),
        avgHoursToSell: parseFloat(avgTimeResult.rows[0].avg_hours_to_sell) || 0
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get nearby vendors (for consumers)
router.get('/nearby', auth, async (req, res) => {
  try {
    const { latitude, longitude, radius = 10, vendorType } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    let query = `
      SELECT v.*, 
             ST_Distance(
               ST_SetSRID(ST_MakePoint($1, $2), 4326),
               ST_SetSRID(ST_MakePoint(v.longitude, v.latitude), 4326)
             ) as distance_km
      FROM vendors v
      WHERE v.is_verified = true
    `;

    const params = [parseFloat(longitude), parseFloat(latitude)];
    let paramCount = 3;

    if (vendorType) {
      query += ` AND v.vendor_type = $${paramCount}`;
      params.push(vendorType);
      paramCount++;
    }

    query += `
      AND ST_DWithin(
        ST_SetSRID(ST_MakePoint($1, $2), 4326),
        ST_SetSRID(ST_MakePoint(v.longitude, v.latitude), 4326),
        $${paramCount} * 1000
      )
      ORDER BY distance_km
      LIMIT 20
    `;

    params.push(parseFloat(radius));

    const result = await db.query(query, params);

    res.json({
      vendors: result.rows.map(vendor => ({
        ...vendor,
        distance_km: parseFloat(vendor.distance_km)
      }))
    });
  } catch (error) {
    console.error('Get nearby vendors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;