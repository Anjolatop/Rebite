import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { createError } from '../middleware/errorHandler';

export class USSDController {
  handleRequest = async (req: Request, res: Response): Promise<void> => {
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
      const { sessionId, phoneNumber, text, serviceCode } = req.body;

      // Parse USSD text input
      const input = text ? text.split('*') : [];
      const lastInput = input[input.length - 1];

      let response = '';

      if (input.length === 0) {
        // Main menu
        response = `CON Welcome to Rebite Food Rescue
1. Browse Listings
2. My Orders
3. My Points
4. My Goals
5. Help
0. Exit`;
      } else if (input.length === 1) {
        switch (lastInput) {
          case '1':
            response = `CON Browse Listings
1. Search by Category
2. Nearby Listings
3. Rescue Deals
4. Back to Main Menu`;
            break;
          case '2':
            response = `CON My Orders
1. Recent Orders
2. Pending Orders
3. Completed Orders
4. Back to Main Menu`;
            break;
          case '3':
            response = `CON My Points
1. Check Balance
2. Points History
3. Transfer Points
4. Donate Points
5. Back to Main Menu`;
            break;
          case '4':
            response = `CON My Goals
1. View Goals
2. Update Goals
3. Back to Main Menu`;
            break;
          case '5':
            response = `CON Help
1. How to Order
2. Contact Support
3. Back to Main Menu`;
            break;
          case '0':
            response = 'END Thank you for using Rebite!';
            break;
          default:
            response = 'END Invalid option. Please try again.';
        }
      } else {
        // Handle sub-menu selections
        response = await this.handleSubMenu(input, phoneNumber);
      }

      res.json({
        sessionId,
        message: response
      });
    } catch (error) {
      console.error('USSD request error:', error);
      res.json({
        sessionId: req.body.sessionId,
        message: 'END An error occurred. Please try again.'
      });
    }
  };

  private async handleSubMenu(input: string[], phoneNumber: string): Promise<string> {
    const lastInput = input[input.length - 1];
    const previousInput = input[input.length - 2];

    if (previousInput === '1') {
      // Browse Listings sub-menu
      switch (lastInput) {
        case '1':
          return `CON Search by Category
1. Produce
2. Dairy
3. Meat
4. Bakery
5. Prepared Food
6. Back`;
        case '2':
          return await this.getNearbyListings(phoneNumber);
        case '3':
          return await this.getRescueDeals();
        case '4':
          return `CON Main Menu
1. Browse Listings
2. My Orders
3. My Points
4. My Goals
5. Help
0. Exit`;
        default:
          return 'END Invalid option. Please try again.';
      }
    } else if (previousInput === '2') {
      // My Orders sub-menu
      switch (lastInput) {
        case '1':
          return await this.getRecentOrders(phoneNumber);
        case '2':
          return await this.getPendingOrders(phoneNumber);
        case '3':
          return await this.getCompletedOrders(phoneNumber);
        case '4':
          return `CON Main Menu
1. Browse Listings
2. My Orders
3. My Points
4. My Goals
5. Help
0. Exit`;
        default:
          return 'END Invalid option. Please try again.';
      }
    } else if (previousInput === '3') {
      // My Points sub-menu
      switch (lastInput) {
        case '1':
          return await this.getPointsBalance(phoneNumber);
        case '2':
          return await this.getPointsHistory(phoneNumber);
        case '3':
          return `CON Transfer Points
Enter recipient phone number:`;
        case '4':
          return `CON Donate Points
1. Food Bank
2. Local Charity
3. Back`;
        case '5':
          return `CON Main Menu
1. Browse Listings
2. My Orders
3. My Points
4. My Goals
5. Help
0. Exit`;
        default:
          return 'END Invalid option. Please try again.';
      }
    }

    return 'END Invalid option. Please try again.';
  }

  public async getNearbyListings(phoneNumber: string): Promise<string> {
    try {
      const listings = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.title',
          'listings.price',
          'vendors.business_name'
        )
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date())
        .orderBy('listings.rescue_score', 'desc')
        .limit(5);

      let response = 'CON Nearby Listings\n';
      listings.forEach((listing, index) => {
        response += `${index + 1}. ${listing.title} - $${listing.price} at ${listing.business_name}\n`;
      });
      response += '6. Back';

      return response;
    } catch (error) {
      return 'END Unable to fetch nearby listings. Please try again.';
    }
  }

  private async getRescueDeals(): Promise<string> {
    try {
      const deals = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.title',
          'listings.price',
          'listings.rescue_score',
          'vendors.business_name'
        )
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date())
        .where('listings.rescue_score', '>=', 80)
        .orderBy('listings.rescue_score', 'desc')
        .limit(5);

      let response = 'CON Rescue Deals\n';
      deals.forEach((deal, index) => {
        response += `${index + 1}. ${deal.title} - $${deal.price} (${deal.rescue_score}% rescue score) at ${deal.business_name}\n`;
      });
      response += '6. Back';

      return response;
    } catch (error) {
      return 'END Unable to fetch rescue deals. Please try again.';
    }
  }

  private async getRecentOrders(phoneNumber: string): Promise<string> {
    try {
      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        return 'END User not found. Please register first.';
      }

      const orders = await db('orders')
        .join('vendors', 'orders.vendor_id', 'vendors.id')
        .select(
          'orders.id',
          'orders.total_amount',
          'orders.status',
          'vendors.business_name'
        )
        .where('orders.user_id', user.id)
        .orderBy('orders.created_at', 'desc')
        .limit(3);

      let response = 'CON Recent Orders\n';
      orders.forEach((order, index) => {
        response += `${index + 1}. Order #${order.id} - $${order.total_amount} (${order.status}) at ${order.business_name}\n`;
      });
      response += '4. Back';

      return response;
    } catch (error) {
      return 'END Unable to fetch recent orders. Please try again.';
    }
  }

  private async getPendingOrders(phoneNumber: string): Promise<string> {
    try {
      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        return 'END User not found. Please register first.';
      }

      const orders = await db('orders')
        .join('vendors', 'orders.vendor_id', 'vendors.id')
        .select(
          'orders.id',
          'orders.total_amount',
          'orders.status',
          'vendors.business_name'
        )
        .where('orders.user_id', user.id)
        .whereIn('orders.status', ['pending', 'confirmed', 'preparing'])
        .orderBy('orders.created_at', 'desc');

      if (orders.length === 0) {
        return 'CON No pending orders found.\n1. Back';
      }

      let response = 'CON Pending Orders\n';
      orders.forEach((order, index) => {
        response += `${index + 1}. Order #${order.id} - $${order.total_amount} (${order.status}) at ${order.business_name}\n`;
      });
      response += `${orders.length + 1}. Back`;

      return response;
    } catch (error) {
      return 'END Unable to fetch pending orders. Please try again.';
    }
  }

  private async getCompletedOrders(phoneNumber: string): Promise<string> {
    try {
      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        return 'END User not found. Please register first.';
      }

      const orders = await db('orders')
        .join('vendors', 'orders.vendor_id', 'vendors.id')
        .select(
          'orders.id',
          'orders.total_amount',
          'orders.status',
          'vendors.business_name'
        )
        .where('orders.user_id', user.id)
        .whereIn('orders.status', ['delivered', 'cancelled'])
        .orderBy('orders.created_at', 'desc')
        .limit(5);

      if (orders.length === 0) {
        return 'CON No completed orders found.\n1. Back';
      }

      let response = 'CON Completed Orders\n';
      orders.forEach((order, index) => {
        response += `${index + 1}. Order #${order.id} - $${order.total_amount} (${order.status}) at ${order.business_name}\n`;
      });
      response += `${orders.length + 1}. Back`;

      return response;
    } catch (error) {
      return 'END Unable to fetch completed orders. Please try again.';
    }
  }

  private async getPointsBalance(phoneNumber: string): Promise<string> {
    try {
      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        return 'END User not found. Please register first.';
      }

      const profile = await db('profiles')
        .where('user_id', user.id)
        .first();

      const balance = profile?.total_points || 0;

      return `CON Points Balance
Current Balance: ${balance} points
1. Back`;
    } catch (error) {
      return 'END Unable to fetch points balance. Please try again.';
    }
  }

  private async getPointsHistory(phoneNumber: string): Promise<string> {
    try {
      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        return 'END User not found. Please register first.';
      }

      const transactions = await db('points_transactions')
        .select('type', 'amount', 'description', 'created_at')
        .where('user_id', user.id)
        .orderBy('created_at', 'desc')
        .limit(5);

      if (transactions.length === 0) {
        return 'CON No points history found.\n1. Back';
      }

      let response = 'CON Points History\n';
      transactions.forEach((tx, index) => {
        const date = new Date(tx.created_at).toLocaleDateString();
        response += `${index + 1}. ${tx.type}: ${tx.amount} points (${date})\n`;
      });
      response += `${transactions.length + 1}. Back`;

      return response;
    } catch (error) {
      return 'END Unable to fetch points history. Please try again.';
    }
  }

  registerUser = async (req: Request, res: Response): Promise<void> => {
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
      const { phoneNumber, firstName, lastName, pin } = req.body;

      // Check if user already exists
      const existingUser = await db('users').where('phone', phoneNumber).first();
      if (existingUser) {
        res.status(400).json({
          error: true,
          message: 'User with this phone number already exists'
        });
        return;
      }

      // Create user
      const [user] = await db('users').insert({
        phone: phoneNumber,
        role: 'consumer',
        is_active: true
      }).returning('*');

      // Create profile
      await db('profiles').insert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName
      });

      // Create PIN
      await db('user_pins').insert({
        user_id: user.id,
        pin_hash: pin // In production, hash the PIN
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user.id,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('USSD registration error:', error);
      throw createError('Failed to register user', 500);
    }
  };

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber, pin } = req.body;

      const user = await db('users')
        .join('user_pins', 'users.id', 'user_pins.user_id')
        .select('users.*', 'user_pins.pin_hash')
        .where('users.phone', phoneNumber)
        .first();

      if (!user || user.pin_hash !== pin) { // In production, verify hashed PIN
        res.status(401).json({
          error: true,
          message: 'Invalid phone number or PIN'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('USSD login error:', error);
      throw createError('Failed to login user', 500);
    }
  };

  getMenu = async (req: Request, res: Response): Promise<void> => {
    try {
      const menu = {
        main: [
          'Browse Listings',
          'My Orders',
          'My Points',
          'My Goals',
          'Help'
        ],
        categories: [
          'Produce',
          'Dairy',
          'Meat',
          'Bakery',
          'Prepared Food'
        ]
      };

      res.json({
        success: true,
        data: menu
      });
    } catch (error) {
      console.error('Get menu error:', error);
      throw createError('Failed to get menu', 500);
    }
  };

  getListings = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, page = 1, limit = 10 } = req.query;

      let query = db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name'
        )
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date());

      if (category) {
        query = query.where('listings.category', category);
      }

      const listings = await query
        .orderBy('listings.rescue_score', 'desc')
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

      res.json({
        success: true,
        data: listings
      });
    } catch (error) {
      console.error('Get listings error:', error);
      throw createError('Failed to get listings', 500);
    }
  };

  getListing = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const listing = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name',
          'vendors.phone'
        )
        .where('listings.id', id)
        .where('listings.is_active', true)
        .first();

      if (!listing) {
        res.status(404).json({
          error: true,
          message: 'Listing not found'
        });
        return;
      }

      res.json({
        success: true,
        data: listing
      });
    } catch (error) {
      console.error('Get listing error:', error);
      throw createError('Failed to get listing', 500);
    }
  };

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber, listingId, quantity, deliveryAddress } = req.body;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      const listing = await db('listings')
        .where('id', listingId)
        .where('is_active', true)
        .first();

      if (!listing) {
        res.status(404).json({
          error: true,
          message: 'Listing not found'
        });
        return;
      }

      const totalAmount = listing.price * quantity;

      const [order] = await db('orders').insert({
        user_id: user.id,
        vendor_id: listing.vendor_id,
        total_amount: totalAmount,
        status: 'pending',
        delivery_address: JSON.stringify(deliveryAddress)
      }).returning('*');

      await db('order_items').insert({
        order_id: order.id,
        listing_id: listingId,
        quantity,
        unit_price: listing.price,
        total_price: totalAmount
      });

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

  getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.query;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      const orders = await db('orders')
        .join('vendors', 'orders.vendor_id', 'vendors.id')
        .select(
          'orders.*',
          'vendors.business_name'
        )
        .where('orders.user_id', user.id)
        .orderBy('orders.created_at', 'desc');

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get orders error:', error);
      throw createError('Failed to get orders', 500);
    }
  };

  getOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { phoneNumber } = req.query;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      const order = await db('orders')
        .join('vendors', 'orders.vendor_id', 'vendors.id')
        .select(
          'orders.*',
          'vendors.business_name'
        )
        .where('orders.id', id)
        .where('orders.user_id', user.id)
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
        data: order
      });
    } catch (error) {
      console.error('Get order error:', error);
      throw createError('Failed to get order', 500);
    }
  };

  getPoints = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.query;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      const profile = await db('profiles')
        .where('user_id', user.id)
        .first();

      res.json({
        success: true,
        data: {
          balance: profile?.total_points || 0
        }
      });
    } catch (error) {
      console.error('Get points error:', error);
      throw createError('Failed to get points', 500);
    }
  };

  transferPoints = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber, recipientPhone, amount, message } = req.body;

      const user = await db('users').where('phone', phoneNumber).first();
      const recipient = await db('users').where('phone', recipientPhone).first();

      if (!user || !recipient) {
        res.status(404).json({
          error: true,
          message: 'User or recipient not found'
        });
        return;
      }

      const userProfile = await db('profiles').where('user_id', user.id).first();
      if (!userProfile || userProfile.total_points < amount) {
        res.status(400).json({
          error: true,
          message: 'Insufficient points'
        });
        return;
      }

      // Transfer points
      await db('profiles')
        .where('user_id', user.id)
        .decrement('total_points', amount);

      await db('profiles')
        .where('user_id', recipient.id)
        .increment('total_points', amount);

      res.json({
        success: true,
        message: 'Points transferred successfully'
      });
    } catch (error) {
      console.error('Transfer points error:', error);
      throw createError('Failed to transfer points', 500);
    }
  };

  donatePoints = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber, charityId, amount } = req.body;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      const userProfile = await db('profiles').where('user_id', user.id).first();
      if (!userProfile || userProfile.total_points < amount) {
        res.status(400).json({
          error: true,
          message: 'Insufficient points'
        });
        return;
      }

      // Deduct points
      await db('profiles')
        .where('user_id', user.id)
        .decrement('total_points', amount);

      res.json({
        success: true,
        message: 'Points donated successfully'
      });
    } catch (error) {
      console.error('Donate points error:', error);
      throw createError('Failed to donate points', 500);
    }
  };

  getGoals = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.query;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      const goals = await db('user_goals')
        .where('user_id', user.id)
        .orderBy('created_at', 'desc');

      res.json({
        success: true,
        data: goals
      });
    } catch (error) {
      console.error('Get goals error:', error);
      throw createError('Failed to get goals', 500);
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.query;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      const profile = await db('profiles')
        .where('user_id', user.id)
        .first();

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Get profile error:', error);
      throw createError('Failed to get profile', 500);
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.query;
      const updateData = req.body;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      await db('profiles')
        .where('user_id', user.id)
        .update(updateData);

      res.json({
        success: true,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw createError('Failed to update profile', 500);
    }
  };

  getHelp = async (req: Request, res: Response): Promise<void> => {
    try {
      const help = {
        howToOrder: [
          '1. Browse available listings',
          '2. Select items you want',
          '3. Provide delivery address',
          '4. Confirm your order',
          '5. Track your delivery'
        ],
        contactSupport: {
          phone: '+1234567890',
          email: 'support@rebite.com',
          hours: '24/7'
        }
      };

      res.json({
        success: true,
        data: help
      });
    } catch (error) {
      console.error('Get help error:', error);
      throw createError('Failed to get help', 500);
    }
  };

  getSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.query;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      const settings = await db('user_settings')
        .where('user_id', user.id)
        .first();

      res.json({
        success: true,
        data: settings || {}
      });
    } catch (error) {
      console.error('Get settings error:', error);
      throw createError('Failed to get settings', 500);
    }
  };

  updateSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.query;
      const settingsData = req.body;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      await db('user_settings')
        .where('user_id', user.id)
        .del();

      await db('user_settings').insert({
        user_id: user.id,
        ...settingsData
      });

      res.json({
        success: true,
        message: 'Settings updated successfully'
      });
    } catch (error) {
      console.error('Update settings error:', error);
      throw createError('Failed to update settings', 500);
    }
  };

  getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.query;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      const notifications = await db('notifications')
        .where('user_id', user.id)
        .orderBy('created_at', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      throw createError('Failed to get notifications', 500);
    }
  };

  markNotificationsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.query;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      await db('notifications')
        .where('user_id', user.id)
        .where('is_read', false)
        .update({ is_read: true });

      res.json({
        success: true,
        message: 'Notifications marked as read'
      });
    } catch (error) {
      console.error('Mark notifications read error:', error);
      throw createError('Failed to mark notifications as read', 500);
    }
  };

  searchListings = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query, category } = req.query;

      let searchQuery = db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name'
        )
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date());

      if (query) {
        searchQuery = searchQuery.where(function() {
          this.where('listings.title', 'ilike', `%${query}%`)
            .orWhere('vendors.business_name', 'ilike', `%${query}%`);
        });
      }

      if (category) {
        searchQuery = searchQuery.where('listings.category', category);
      }

      const listings = await searchQuery
        .orderBy('listings.rescue_score', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: listings
      });
    } catch (error) {
      console.error('Search listings error:', error);
      throw createError('Failed to search listings', 500);
    }
  };

  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await db('listings')
        .select('category')
        .count('* as count')
        .where('is_active', true)
        .where('expiry_date', '>', new Date())
        .groupBy('category')
        .orderBy('count', 'desc');

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Get categories error:', error);
      throw createError('Failed to get categories', 500);
    }
  };

  getListingsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.params;

      const listings = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name'
        )
        .where('listings.category', category)
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date())
        .orderBy('listings.rescue_score', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: listings
      });
    } catch (error) {
      console.error('Get listings by category error:', error);
      throw createError('Failed to get listings by category', 500);
    }
  };

  getNearbyListingsAPI = async (req: Request, res: Response): Promise<void> => {
    try {
      const { latitude, longitude, radius = 10 } = req.query;

      if (!latitude || !longitude) {
        res.status(400).json({
          error: true,
          message: 'Location coordinates are required'
        });
        return;
      }

      const listings = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name',
          db.raw('ST_Distance(listings.location, ST_MakePoint(?, ?)) as distance')
        )
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date())
        .whereRaw('ST_DWithin(listings.location, ST_MakePoint(?, ?), ?)', [
          longitude, latitude, Number(radius) * 1000
        ])
        .orderBy('distance', 'asc')
        .limit(10);

      res.json({
        success: true,
        data: listings
      });
    } catch (error) {
      console.error('Get nearby listings error:', error);
      throw createError('Failed to get nearby listings', 500);
    }
  };

  getFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.query;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      const favorites = await db('favorites')
        .join('listings', 'favorites.listing_id', 'listings.id')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name'
        )
        .where('favorites.user_id', user.id)
        .where('listings.is_active', true)
        .orderBy('favorites.created_at', 'desc');

      res.json({
        success: true,
        data: favorites
      });
    } catch (error) {
      console.error('Get favorites error:', error);
      throw createError('Failed to get favorites', 500);
    }
  };

  toggleFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.query;
      const { id } = req.params;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      const existingFavorite = await db('favorites')
        .where('user_id', user.id)
        .where('listing_id', id)
        .first();

      if (existingFavorite) {
        await db('favorites')
          .where('user_id', user.id)
          .where('listing_id', id)
          .del();

        res.json({
          success: true,
          message: 'Removed from favorites',
          isFavorite: false
        });
      } else {
        await db('favorites').insert({
          user_id: user.id,
          listing_id: id
        });

        res.json({
          success: true,
          message: 'Added to favorites',
          isFavorite: true
        });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      throw createError('Failed to toggle favorite', 500);
    }
  };

  getVendors = async (req: Request, res: Response): Promise<void> => {
    try {
      const vendors = await db('vendors')
        .select('*')
        .where('is_verified', true)
        .orderBy('business_name');

      res.json({
        success: true,
        data: vendors
      });
    } catch (error) {
      console.error('Get vendors error:', error);
      throw createError('Failed to get vendors', 500);
    }
  };

  getVendor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const vendor = await db('vendors')
        .where('id', id)
        .first();

      if (!vendor) {
        res.status(404).json({
          error: true,
          message: 'Vendor not found'
        });
        return;
      }

      res.json({
        success: true,
        data: vendor
      });
    } catch (error) {
      console.error('Get vendor error:', error);
      throw createError('Failed to get vendor', 500);
    }
  };

  getDeals = async (req: Request, res: Response): Promise<void> => {
    try {
      const deals = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name'
        )
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date())
        .where('listings.rescue_score', '>=', 80)
        .orderBy('listings.rescue_score', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: deals
      });
    } catch (error) {
      console.error('Get deals error:', error);
      throw createError('Failed to get deals', 500);
    }
  };

  getRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
      const recipes = await db('recipes')
        .select('*')
        .where('is_active', true)
        .orderBy('rating', 'desc')
        .limit(5);

      res.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Get recipes error:', error);
      throw createError('Failed to get recipes', 500);
    }
  };

  getRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const recipe = await db('recipes')
        .where('id', id)
        .where('is_active', true)
        .first();

      if (!recipe) {
        res.status(404).json({
          error: true,
          message: 'Recipe not found'
        });
        return;
      }

      res.json({
        success: true,
        data: recipe
      });
    } catch (error) {
      console.error('Get recipe error:', error);
      throw createError('Failed to get recipe', 500);
    }
  };

  submitFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber, feedback, rating } = req.body;

      const user = await db('users').where('phone', phoneNumber).first();
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      await db('feedback').insert({
        user_id: user.id,
        feedback,
        rating,
        source: 'ussd'
      });

      res.json({
        success: true,
        message: 'Feedback submitted successfully'
      });
    } catch (error) {
      console.error('Submit feedback error:', error);
      throw createError('Failed to submit feedback', 500);
    }
  };
} 