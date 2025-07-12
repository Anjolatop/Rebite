import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { createError } from '../middleware/errorHandler';

export class OrderController {
  getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { page = 1, limit = 20, status } = req.query;

      const offset = (Number(page) - 1) * Number(limit);
      let query = db('orders')
        .join('vendors', 'orders.vendor_id', 'vendors.id')
        .select(
          'orders.*',
          'vendors.business_name',
          'vendors.business_type'
        )
        .where('orders.user_id', userId);

      if (status) {
        query = query.where('orders.status', status);
      }

      const orders = await query
        .orderBy('orders.created_at', 'desc')
        .limit(Number(limit))
        .offset(offset);

      const total = await query.clone().count('* as count').first();
      const totalCount = Number(total?.count) || 0;
      res.json({
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get orders error:', error);
      throw createError('Failed to get orders', 500);
    }
  };

  getOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const order = await db('orders')
        .join('vendors', 'orders.vendor_id', 'vendors.id')
        .select(
          'orders.*',
          'vendors.business_name',
          'vendors.business_type',
          'vendors.phone as vendor_phone'
        )
        .where('orders.id', id)
        .where('orders.user_id', userId)
        .first();

      if (!order) {
        res.status(404).json({
          error: true,
          message: 'Order not found'
        });
        return;
      }

      // Get order items
      const items = await db('order_items')
        .join('listings', 'order_items.listing_id', 'listings.id')
        .select(
          'order_items.*',
          'listings.title',
          'listings.description',
          'listings.images'
        )
        .where('order_items.order_id', id);

      res.json({
        success: true,
        data: {
          ...order,
          items
        }
      });
    } catch (error) {
      console.error('Get order error:', error);
      throw createError('Failed to get order', 500);
    }
  };

  createOrder = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: true, 
        message: 'Validation failed',
        errors: errors.array() 
      });
      return;
    }

    try {
      const userId = (req as any).user.id;
      const { items, deliveryAddress, deliveryInstructions, paymentMethod, usePoints, pointsToUse } = req.body;

      // Calculate total
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const listing = await db('listings')
          .where('id', item.listingId)
          .where('is_active', true)
          .first();

        if (!listing) {
          res.status(400).json({
            error: true,
            message: `Listing ${item.listingId} not found or inactive`
          });
          return;
        }

        if (listing.quantity < item.quantity) {
          res.status(400).json({
            error: true,
            message: `Insufficient quantity for ${listing.title}`
          });
          return;
        }

        const itemTotal = listing.price * item.quantity;
        total += itemTotal;

        orderItems.push({
          listing_id: item.listingId,
          quantity: item.quantity,
          unit_price: listing.price,
          total_price: itemTotal
        });
      }

      // Apply points discount if requested
      let pointsUsed = 0;
      if (usePoints && pointsToUse > 0) {
        const userProfile = await db('profiles')
          .where('user_id', userId)
          .first();

        if (userProfile && userProfile.total_points >= pointsToUse) {
          const pointsValue = pointsToUse * 0.01; // 1 point = $0.01
          total = Math.max(0, total - pointsValue);
          pointsUsed = pointsToUse;
        }
      }

      // Create order
      const [order] = await db('orders').insert({
        user_id: userId,
        vendor_id: orderItems[0].listing_id, // Assuming all items from same vendor
        total_amount: total,
        status: 'pending',
        delivery_address: JSON.stringify(deliveryAddress),
        delivery_instructions: deliveryInstructions,
        payment_method: paymentMethod,
        points_used: pointsUsed
      }).returning('*');

      // Create order items
      for (const item of orderItems) {
        await db('order_items').insert({
          order_id: order.id,
          ...item
        });

        // Update listing quantity
        await db('listings')
          .where('id', item.listing_id)
          .decrement('quantity', item.quantity);
      }

      // Deduct points if used
      if (pointsUsed > 0) {
        await db('profiles')
          .where('user_id', userId)
          .decrement('total_points', pointsUsed);

        // Record points transaction
        await db('points_transactions').insert({
          user_id: userId,
          type: 'spent',
          amount: -pointsUsed,
          description: `Used ${pointsUsed} points for order ${order.id}`
        });
      }

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      console.error('Create order error:', error);
      throw createError('Failed to create order', 500);
    }
  };

  updateOrder = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: true, 
        message: 'Validation failed',
        errors: errors.array() 
      });
      return;
    }

    try {
      const { id } = req.params;
      const { status, estimatedDeliveryTime, trackingNumber } = req.body;

      const [updatedOrder] = await db('orders')
        .where('id', id)
        .update({
          status,
          estimated_delivery_time: estimatedDeliveryTime,
          tracking_number: trackingNumber,
          updated_at: new Date()
        })
        .returning('*');

      if (!updatedOrder) {
        res.status(404).json({
          error: true,
          message: 'Order not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Order updated successfully',
        data: updatedOrder
      });
    } catch (error) {
      console.error('Update order error:', error);
      throw createError('Failed to update order', 500);
    }
  };

  cancelOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const order = await db('orders')
        .where('id', id)
        .where('user_id', userId)
        .first();

      if (!order) {
        res.status(404).json({
          error: true,
          message: 'Order not found'
        });
        return;
      }

      if (order.status !== 'pending' && order.status !== 'confirmed') {
        res.status(400).json({
          error: true,
          message: 'Order cannot be cancelled at this stage'
        });
        return;
      }

      // Update order status
      await db('orders')
        .where('id', id)
        .update({
          status: 'cancelled',
          updated_at: new Date()
        });

      // Restore listing quantities
      const orderItems = await db('order_items')
        .where('order_id', id);

      for (const item of orderItems) {
        await db('listings')
          .where('id', item.listing_id)
          .increment('quantity', item.quantity);
      }

      // Refund points if used
      if (order.points_used > 0) {
        await db('profiles')
          .where('user_id', userId)
          .increment('total_points', order.points_used);

        // Record points transaction
        await db('points_transactions').insert({
          user_id: userId,
          type: 'refund',
          amount: order.points_used,
          description: `Refunded ${order.points_used} points for cancelled order ${id}`
        });
      }

      res.json({
        success: true,
        message: 'Order cancelled successfully'
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      throw createError('Failed to cancel order', 500);
    }
  };

  processPayment = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: true, 
        message: 'Validation failed',
        errors: errors.array() 
      });
      return;
    }

    try {
      const { id } = req.params;
      const { paymentMethod, paymentToken, pointsToUse } = req.body;

      const order = await db('orders')
        .where('id', id)
        .first();

      if (!order) {
        res.status(404).json({
          error: true,
          message: 'Order not found'
        });
        return;
      }

      if (order.status !== 'pending') {
        res.status(400).json({
          error: true,
          message: 'Order cannot be paid at this stage'
        });
        return;
      }

      // Process payment based on method
      if (paymentMethod === 'card' && paymentToken) {
        // Integrate with Stripe here
        // For now, just mark as paid
        await db('orders')
          .where('id', id)
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            updated_at: new Date()
          });
      } else if (paymentMethod === 'points') {
        // Handle points payment
        const userProfile = await db('profiles')
          .where('user_id', order.user_id)
          .first();

        if (!userProfile || userProfile.total_points < pointsToUse) {
          res.status(400).json({
            error: true,
            message: 'Insufficient points'
          });
          return;
        }

        await db('profiles')
          .where('user_id', order.user_id)
          .decrement('total_points', pointsToUse);

        await db('orders')
          .where('id', id)
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            points_used: pointsToUse,
            updated_at: new Date()
          });

        // Record points transaction
        await db('points_transactions').insert({
          user_id: order.user_id,
          type: 'spent',
          amount: -pointsToUse,
          description: `Used ${pointsToUse} points for order ${id}`
        });
      }

      res.json({
        success: true,
        message: 'Payment processed successfully'
      });
    } catch (error) {
      console.error('Process payment error:', error);
      throw createError('Failed to process payment', 500);
    }
  };

  getTrackingInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const order = await db('orders')
        .select('tracking_number', 'status', 'estimated_delivery_time')
        .where('id', id)
        .first();

      if (!order) {
        res.status(404).json({
          error: true,
          message: 'Order not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          trackingNumber: order.tracking_number,
          status: order.status,
          estimatedDeliveryTime: order.estimated_delivery_time
        }
      });
    } catch (error) {
      console.error('Get tracking info error:', error);
      throw createError('Failed to get tracking info', 500);
    }
  };

  updateTracking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, location } = req.body;

      await db('orders')
        .where('id', id)
        .update({
          status,
          updated_at: new Date()
        });

      res.json({
        success: true,
        message: 'Tracking updated successfully'
      });
    } catch (error) {
      console.error('Update tracking error:', error);
      throw createError('Failed to update tracking', 500);
    }
  };

  getOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const order = await db('orders')
        .select('status', 'created_at', 'updated_at')
        .where('id', id)
        .first();

      if (!order) {
        res.status(404).json({
          error: true,
          message: 'Order not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          status: order.status,
          createdAt: order.created_at,
          updatedAt: order.updated_at
        }
      });
    } catch (error) {
      console.error('Get order status error:', error);
      throw createError('Failed to get order status', 500);
    }
  };

  rateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const { rating, review } = req.body;

      const order = await db('orders')
        .where('id', id)
        .where('user_id', userId)
        .first();

      if (!order) {
        res.status(404).json({
          error: true,
          message: 'Order not found'
        });
        return;
      }

      if (order.status !== 'delivered') {
        res.status(400).json({
          error: true,
          message: 'Order must be delivered before rating'
        });
        return;
      }

      await db('order_ratings').insert({
        order_id: id,
        user_id: userId,
        rating,
        review
      });

      res.json({
        success: true,
        message: 'Order rated successfully'
      });
    } catch (error) {
      console.error('Rate order error:', error);
      throw createError('Failed to rate order', 500);
    }
  };

  getReceipt = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const order = await db('orders')
        .join('vendors', 'orders.vendor_id', 'vendors.id')
        .select(
          'orders.*',
          'vendors.business_name',
          'vendors.business_type'
        )
        .where('orders.id', id)
        .where('orders.user_id', userId)
        .first();

      if (!order) {
        res.status(404).json({
          error: true,
          message: 'Order not found'
        });
        return;
      }

      const items = await db('order_items')
        .join('listings', 'order_items.listing_id', 'listings.id')
        .select(
          'order_items.*',
          'listings.title'
        )
        .where('order_items.order_id', id);

      res.json({
        success: true,
        data: {
          ...order,
          items
        }
      });
    } catch (error) {
      console.error('Get receipt error:', error);
      throw createError('Failed to get receipt', 500);
    }
  };

  createDispute = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const { reason, description } = req.body;

      const order = await db('orders')
        .where('id', id)
        .where('user_id', userId)
        .first();

      if (!order) {
        res.status(404).json({
          error: true,
          message: 'Order not found'
        });
        return;
      }

      await db('disputes').insert({
        order_id: id,
        user_id: userId,
        reason,
        description,
        status: 'pending'
      });

      res.json({
        success: true,
        message: 'Dispute created successfully'
      });
    } catch (error) {
      console.error('Create dispute error:', error);
      throw createError('Failed to create dispute', 500);
    }
  };

  getDisputes = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const disputes = await db('disputes')
        .where('order_id', id)
        .where('user_id', userId)
        .orderBy('created_at', 'desc');

      res.json({
        success: true,
        data: disputes
      });
    } catch (error) {
      console.error('Get disputes error:', error);
      throw createError('Failed to get disputes', 500);
    }
  };

  getOrderAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { period = '30' } = req.query;

      const analytics = await db('orders')
        .select(
          db.raw('COUNT(*) as total_orders'),
          db.raw('SUM(total_amount) as total_spent'),
          db.raw('AVG(total_amount) as average_order_value')
        )
        .where('user_id', userId)
        .whereRaw(`created_at >= NOW() - INTERVAL '${period} days'`)
        .first();

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Get order analytics error:', error);
      throw createError('Failed to get order analytics', 500);
    }
  };

  getPendingOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const orders = await db('orders')
        .join('vendors', 'orders.vendor_id', 'vendors.id')
        .select(
          'orders.*',
          'vendors.business_name'
        )
        .where('orders.user_id', userId)
        .whereIn('orders.status', ['pending', 'confirmed', 'preparing'])
        .orderBy('orders.created_at', 'desc');

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get pending orders error:', error);
      throw createError('Failed to get pending orders', 500);
    }
  };

  getCompletedOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const orders = await db('orders')
        .join('vendors', 'orders.vendor_id', 'vendors.id')
        .select(
          'orders.*',
          'vendors.business_name'
        )
        .where('orders.user_id', userId)
        .whereIn('orders.status', ['delivered', 'cancelled'])
        .orderBy('orders.created_at', 'desc');

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get completed orders error:', error);
      throw createError('Failed to get completed orders', 500);
    }
  };
} 