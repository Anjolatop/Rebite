import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { createError } from '../middleware/errorHandler';

export class VendorController {
  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const vendor = await db('vendors')
        .select('*')
        .where('user_id', userId)
        .first();

      if (!vendor) {
        throw createError('Vendor profile not found', 404);
      }

      res.json({
        success: true,
        data: vendor
      });
    } catch (error) {
      console.error('Get vendor profile error:', error);
      throw createError('Failed to get vendor profile', 500);
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: true, 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    try {
      const userId = (req as any).user.id;
      const updateData = req.body;

      const [updatedVendor] = await db('vendors')
        .where('user_id', userId)
        .update(updateData)
        .returning('*');

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedVendor
      });
      return;
    } catch (error) {
      console.error('Update vendor profile error:', error);
      throw createError('Failed to update vendor profile', 500);
    }
  };

  getDashboard = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      // Get recent orders
      const recentOrders = await db('orders')
        .select('*')
        .where('vendor_id', vendor.id)
        .orderBy('created_at', 'desc')
        .limit(5);

      // Get active listings
      const activeListings = await db('listings')
        .select('*')
        .where('vendor_id', vendor.id)
        .where('is_active', true)
        .orderBy('created_at', 'desc');

      // Get today's earnings
      const todayEarnings = await db('orders')
        .sum('total_amount as total')
        .where('vendor_id', vendor.id)
        .whereRaw('DATE(created_at) = CURRENT_DATE')
        .first();

      // Get pending orders count
      const pendingOrders = await db('orders')
        .count('* as count')
        .where('vendor_id', vendor.id)
        .whereIn('status', ['pending', 'confirmed'])
        .first();

      res.json({
        success: true,
        data: {
          recentOrders,
          activeListings,
          todayEarnings: todayEarnings?.total || 0,
          pendingOrders: pendingOrders?.count || 0
        }
      });
    } catch (error) {
      console.error('Get dashboard error:', error);
      throw createError('Failed to get dashboard', 500);
    }
  };

  getAnalytics = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { period = '30' } = req.query;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      // Get sales analytics
      const salesData = await db('orders')
        .select(
          db.raw('DATE(created_at) as date'),
          db.raw('COUNT(*) as orders'),
          db.raw('SUM(total_amount) as revenue')
        )
        .where('vendor_id', vendor.id)
        .whereRaw(`created_at >= NOW() - INTERVAL '${period} days'`)
        .groupByRaw('DATE(created_at)')
        .orderBy('date', 'asc');

      // Get top selling items
      const topItems = await db('order_items')
        .join('listings', 'order_items.listing_id', 'listings.id')
        .select(
          'listings.title',
          db.raw('SUM(order_items.quantity) as total_sold'),
          db.raw('SUM(order_items.quantity * order_items.unit_price) as revenue')
        )
        .where('listings.vendor_id', vendor.id)
        .groupBy('listings.id', 'listings.title')
        .orderBy('total_sold', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: {
          salesData,
          topItems
        }
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      throw createError('Failed to get analytics', 500);
    }
  };

  getOrders = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { status, page = 1, limit = 20 } = req.query;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const offset = (Number(page) - 1) * Number(limit);
      let query = db('orders')
        .select('*')
        .where('vendor_id', vendor.id);

      if (status) {
        query = query.where('status', status);
      }

      const orders = await query
        .orderBy('created_at', 'desc')
        .limit(Number(limit))
        .offset(offset);

      const total = await query.clone().count('* as count').first();

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: total?.count || 0,
          pages: Math.ceil(Number(total?.count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get orders error:', error);
      throw createError('Failed to get orders', 500);
    }
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { orderId } = req.params;
      const { status } = req.body;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const [updatedOrder] = await db('orders')
        .where('id', orderId)
        .where('vendor_id', vendor.id)
        .update({ status })
        .returning('*');

      if (!updatedOrder) {
        throw createError('Order not found', 404);
      }

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder
      });
    } catch (error) {
      console.error('Update order status error:', error);
      throw createError('Failed to update order status', 500);
    }
  };

  getListings = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const { page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      const listings = await db('listings')
        .where('vendor_id', vendor.id)
        .orderBy('created_at', 'desc')
        .limit(Number(limit))
        .offset(offset);
      const total = await db('listings')
        .where('vendor_id', vendor.id)
        .count('* as count')
        .first();
      const totalCount = Number(total?.count) || 0;
      res.json({
        success: true,
        data: listings,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          pages: Math.ceil(Number(total?.count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get listings error:', error);
      throw createError('Failed to get listings', 500);
    }
  };

  createListing = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const [newListing] = await db('listings')
        .insert({
          vendor_id: vendor.id,
          ...req.body
        })
        .returning('*');

      res.status(201).json({
        success: true,
        message: 'Listing created successfully',
        data: newListing
      });
    } catch (error) {
      console.error('Create listing error:', error);
      throw createError('Failed to create listing', 500);
    }
  };

  updateListing = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { listingId } = req.params;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const [updatedListing] = await db('listings')
        .where('id', listingId)
        .where('vendor_id', vendor.id)
        .update(req.body)
        .returning('*');

      if (!updatedListing) {
        throw createError('Listing not found', 404);
      }

      res.json({
        success: true,
        message: 'Listing updated successfully',
        data: updatedListing
      });
    } catch (error) {
      console.error('Update listing error:', error);
      throw createError('Failed to update listing', 500);
    }
  };

  deleteListing = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { listingId } = req.params;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const deleted = await db('listings')
        .where('id', listingId)
        .where('vendor_id', vendor.id)
        .del();

      if (!deleted) {
        throw createError('Listing not found', 404);
      }

      res.json({
        success: true,
        message: 'Listing deleted successfully'
      });
    } catch (error) {
      console.error('Delete listing error:', error);
      throw createError('Failed to delete listing', 500);
    }
  };

  updateBusinessHours = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { hours } = req.body;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      await db('business_hours')
        .where('vendor_id', vendor.id)
        .del();

      if (hours && hours.length > 0) {
        const hoursToInsert = hours.map((hour: any) => ({
          vendor_id: vendor.id,
          ...hour
        }));

        await db('business_hours').insert(hoursToInsert);
      }

      res.json({
        success: true,
        message: 'Business hours updated successfully'
      });
    } catch (error) {
      console.error('Update business hours error:', error);
      throw createError('Failed to update business hours', 500);
    }
  };

  getBusinessHours = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const hours = await db('business_hours')
        .select('*')
        .where('vendor_id', vendor.id)
        .orderBy('day');

      res.json({
        success: true,
        data: hours
      });
    } catch (error) {
      console.error('Get business hours error:', error);
      throw createError('Failed to get business hours', 500);
    }
  };

  updatePaymentInfo = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      await db('vendor_payment_info')
        .where('vendor_id', vendor.id)
        .del();

      await db('vendor_payment_info').insert({
        vendor_id: vendor.id,
        ...req.body
      });

      res.json({
        success: true,
        message: 'Payment info updated successfully'
      });
    } catch (error) {
      console.error('Update payment info error:', error);
      throw createError('Failed to update payment info', 500);
    }
  };

  getPaymentInfo = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const paymentInfo = await db('vendor_payment_info')
        .select('*')
        .where('vendor_id', vendor.id)
        .first();

      res.json({
        success: true,
        data: paymentInfo || {}
      });
    } catch (error) {
      console.error('Get payment info error:', error);
      throw createError('Failed to get payment info', 500);
    }
  };

  submitVerification = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      await db('vendor_verifications').insert({
        vendor_id: vendor.id,
        documents: JSON.stringify(req.body.documents),
        status: 'pending'
      });

      res.json({
        success: true,
        message: 'Verification submitted successfully'
      });
    } catch (error) {
      console.error('Submit verification error:', error);
      throw createError('Failed to submit verification', 500);
    }
  };

  getVerificationStatus = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const verification = await db('vendor_verifications')
        .select('*')
        .where('vendor_id', vendor.id)
        .orderBy('created_at', 'desc')
        .first();

      res.json({
        success: true,
        data: verification || { status: 'not_submitted' }
      });
    } catch (error) {
      console.error('Get verification status error:', error);
      throw createError('Failed to get verification status', 500);
    }
  };

  getEarnings = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { period = '30' } = req.query;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const earnings = await db('orders')
        .select(
          db.raw('DATE(created_at) as date'),
          db.raw('SUM(total_amount) as revenue'),
          db.raw('COUNT(*) as orders')
        )
        .where('vendor_id', vendor.id)
        .whereRaw(`created_at >= NOW() - INTERVAL '${period} days'`)
        .groupByRaw('DATE(created_at)')
        .orderBy('date', 'desc');

      const totalEarnings = await db('orders')
        .sum('total_amount as total')
        .where('vendor_id', vendor.id)
        .whereRaw(`created_at >= NOW() - INTERVAL '${period} days'`)
        .first();

      res.json({
        success: true,
        data: {
          earnings,
          total: totalEarnings?.total || 0
        }
      });
    } catch (error) {
      console.error('Get earnings error:', error);
      throw createError('Failed to get earnings', 500);
    }
  };

  getCustomers = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const customers = await db('orders')
        .join('users', 'orders.user_id', 'users.id')
        .join('profiles', 'users.id', 'profiles.user_id')
        .select(
          'users.id',
          'profiles.first_name',
          'profiles.last_name',
          db.raw('COUNT(orders.id) as order_count'),
          db.raw('SUM(orders.total_amount) as total_spent')
        )
        .where('orders.vendor_id', vendor.id)
        .groupBy('users.id', 'profiles.first_name', 'profiles.last_name')
        .orderBy('total_spent', 'desc');

      res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Get customers error:', error);
      throw createError('Failed to get customers', 500);
    }
  };
} 