import { Server } from 'socket.io';
import { db } from '../config/database';
import { redis } from '../config/redis';

export const initializeSocketIO = (io: Server) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      // Verify token (simplified for demo)
      // In production, use proper JWT verification
      const userId = token; // Simplified for demo
      
      // Get user from database
      const user = await db('users')
        .select('id', 'email', 'role')
        .where('id', userId)
        .first();

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    const user = socket.data.user;
    console.log(`User ${user.email} connected`);

    // Join user to their personal room
    socket.join(`user:${user.id}`);

    // Join vendor room if user is a vendor
    if (user.role === 'vendor') {
      const vendor = await db('vendors')
        .where('user_id', user.id)
        .first();
      
      if (vendor) {
        socket.join(`vendor:${vendor.id}`);
      }
    }

    // Handle order updates
    socket.on('order:update', async (data) => {
      try {
        const { orderId, status, message } = data;
        
        // Update order in database
        await db('orders')
          .where('id', orderId)
          .update({ 
            status,
            updated_at: new Date()
          });

        // Get order details
        const order = await db('orders')
          .select('user_id', 'vendor_id', 'order_number')
          .where('id', orderId)
          .first();

        if (order) {
          // Notify customer
          io.to(`user:${order.user_id}`).emit('order:status_update', {
            orderId,
            orderNumber: order.order_number,
            status,
            message,
            timestamp: new Date()
          });

          // Notify vendor
          io.to(`vendor:${order.vendor_id}`).emit('order:status_update', {
            orderId,
            orderNumber: order.order_number,
            status,
            message,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Order update error:', error);
      }
    });

    // Handle new listings
    socket.on('listing:create', async (data) => {
      try {
        const { vendorId, listingData } = data;
        
        // Get vendor's followers or nearby users
        const nearbyUsers = await db.raw(`
          SELECT DISTINCT p.user_id 
          FROM profiles p 
          WHERE ST_DWithin(
            p.location::geography, 
            (SELECT location::geography FROM vendors WHERE id = ?), 
            10000
          )
        `, [vendorId]);

        // Notify nearby users about new listing
        nearbyUsers.rows.forEach((row: any) => {
          io.to(`user:${row.user_id}`).emit('listing:new', {
            vendorId,
            listingData,
            timestamp: new Date()
          });
        });
      } catch (error) {
        console.error('Listing creation error:', error);
      }
    });

    // Handle value bar updates
    socket.on('value:update', async (data) => {
      try {
        const { userId, valueName, newProgress, levelUp } = data;
        
        // Update value bar in database
        await db('profiles')
          .where('user_id', userId)
          .update({
            value_bars: db.raw(`jsonb_set(
              COALESCE(value_bars, '{}'::jsonb), 
              '{${valueName}}', 
              '{"level": ${levelUp ? 1 : 0}, "progress": ${newProgress}}'::jsonb
            )`)
          });

        // Notify user about value update
        io.to(`user:${userId}`).emit('value:updated', {
          valueName,
          newProgress,
          levelUp,
          timestamp: new Date()
        });

        // If level up, send congratulations
        if (levelUp) {
          io.to(`user:${userId}`).emit('value:level_up', {
            valueName,
            newLevel: 1,
            message: `Congratulations! You've leveled up your ${valueName} value!`,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Value update error:', error);
      }
    });

    // Handle points transactions
    socket.on('points:earned', async (data) => {
      try {
        const { userId, points, reason, transactionType } = data;
        
        // Add points transaction
        const [transaction] = await db('points_transactions').insert({
          user_id: userId,
          points,
          transaction_type: transactionType,
          description: reason,
          balance_before: 0, // Will be calculated
          balance_after: points
        }).returning('*');

        // Update user's total points
        await db('profiles')
          .where('user_id', userId)
          .increment('total_points', points);

        // Notify user
        io.to(`user:${userId}`).emit('points:transaction', {
          transaction,
          reason,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Points transaction error:', error);
      }
    });

    // Handle chat messages
    socket.on('chat:message', async (data) => {
      try {
        const { orderId, message, senderId, senderName } = data;
        
        // Store message in database (you'd need a messages table)
        // For now, just broadcast
        
        // Get order participants
        const order = await db('orders')
          .select('user_id', 'vendor_id')
          .where('id', orderId)
          .first();

        if (order) {
          const messageData = {
            orderId,
            message,
            senderId,
            senderName,
            timestamp: new Date()
          };

          // Send to customer
          io.to(`user:${order.user_id}`).emit('chat:message', messageData);
          
          // Send to vendor
          io.to(`vendor:${order.vendor_id}`).emit('chat:message', messageData);
        }
      } catch (error) {
        console.error('Chat message error:', error);
      }
    });

    // Handle location updates
    socket.on('location:update', async (data) => {
      try {
        const { userId, latitude, longitude } = data;
        
        // Update user location
        await db('profiles')
          .where('user_id', userId)
          .update({
            location: db.raw(`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`)
          });

        // Find nearby vendors and notify them
        const nearbyVendors = await db.raw(`
          SELECT v.id, v.user_id 
          FROM vendors v 
          WHERE ST_DWithin(
            v.location::geography, 
            ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, 
            5000
          )
        `);

        nearbyVendors.rows.forEach((vendor: any) => {
          io.to(`vendor:${vendor.id}`).emit('user:nearby', {
            userId,
            latitude,
            longitude,
            timestamp: new Date()
          });
        });
      } catch (error) {
        console.error('Location update error:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${user.email} disconnected`);
    });
  });

  // Broadcast functions for external use
  return {
    // Notify user about new order
    notifyNewOrder: (userId: string, orderData: any) => {
      io.to(`user:${userId}`).emit('order:new', {
        ...orderData,
        timestamp: new Date()
      });
    },

    // Notify vendor about new order
    notifyVendorOrder: (vendorId: string, orderData: any) => {
      io.to(`vendor:${vendorId}`).emit('order:new', {
        ...orderData,
        timestamp: new Date()
      });
    },

    // Notify about expiring listings
    notifyExpiringListings: (vendorId: string, listings: any[]) => {
      io.to(`vendor:${vendorId}`).emit('listings:expiring', {
        listings,
        timestamp: new Date()
      });
    },

    // Notify about points earned
    notifyPointsEarned: (userId: string, points: number, reason: string) => {
      io.to(`user:${userId}`).emit('points:earned', {
        points,
        reason,
        timestamp: new Date()
      });
    },

    // Notify about value level up
    notifyValueLevelUp: (userId: string, valueName: string, newLevel: number) => {
      io.to(`user:${userId}`).emit('value:level_up', {
        valueName,
        newLevel,
        message: `Congratulations! You've reached level ${newLevel} in ${valueName}!`,
        timestamp: new Date()
      });
    }
  };
}; 