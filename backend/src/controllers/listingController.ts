import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { createError } from '../middleware/errorHandler';

export class ListingController {
  getListings = async (req: Request, res: Response) => {
    try {
      const { 
        category, 
        price_min, 
        price_max, 
        distance, 
        page = 1, 
        limit = 20,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);
      let query = db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name',
          'vendors.business_type',
          db.raw('ST_Distance(listings.location, ST_MakePoint(?, ?)) as distance')
        )
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date());

      // Apply filters
      if (category) {
        query = query.where('listings.category', category);
      }

      if (price_min) {
        query = query.where('listings.price', '>=', Number(price_min));
      }

      if (price_max) {
        query = query.where('listings.price', '<=', Number(price_max));
      }

      // Apply sorting
      if (sort_by === 'distance' && distance) {
        query = query.orderBy('distance', String(sort_order));
      } else {
        query = query.orderBy(`listings.${sort_by}`, String(sort_order));
      }

      const listings = await query
        .limit(Number(limit))
        .offset(offset);

      const total = await query.clone().count('* as count').first();

      res.json({
        success: true,
        data: listings,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: total?.count || 0,
          pages: Math.ceil(Number(total?.count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get listings error:', error);
      throw createError('Failed to get listings', 500);
    }
  };

  searchListings = async (req: Request, res: Response) => {
    try {
      const { 
        query, 
        category, 
        dietary_preferences, 
        allergies,
        price_range,
        distance,
        page = 1,
        limit = 20
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);
      let searchQuery = db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name',
          'vendors.business_type'
        )
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date());

      // Text search
      if (query) {
        searchQuery = searchQuery.where(function() {
          this.where('listings.title', 'ilike', `%${query}%`)
            .orWhere('listings.description', 'ilike', `%${query}%`)
            .orWhere('vendors.business_name', 'ilike', `%${query}%`);
        });
      }

      // Category filter
      if (category) {
        searchQuery = searchQuery.where('listings.category', category);
      }

      // Dietary preferences filter
      if (dietary_preferences && Array.isArray(dietary_preferences)) {
        searchQuery = searchQuery.whereRaw(
          'listings.dietary_tags @> ?',
          [JSON.stringify(dietary_preferences)]
        );
      }

      // Allergies filter (exclude items with these allergens)
      if (allergies && Array.isArray(allergies)) {
        searchQuery = searchQuery.whereRaw(
          'NOT (listings.allergens @> ?)',
          [JSON.stringify(allergies)]
        );
      }

      // Price range filter
      if (price_range) {
        const { min, max } = price_range as any;
        if (min) searchQuery = searchQuery.where('listings.price', '>=', Number(min));
        if (max) searchQuery = searchQuery.where('listings.price', '<=', Number(max));
      }

      const listings = await searchQuery
        .orderBy('listings.rescue_score', 'desc')
        .limit(Number(limit))
        .offset(offset);

      const total = await searchQuery.clone().count('* as count').first();

      res.json({
        success: true,
        data: listings,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: total?.count || 0,
          pages: Math.ceil(Number(total?.count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Search listings error:', error);
      throw createError('Failed to search listings', 500);
    }
  };

  getFeaturedListings = async (req: Request, res: Response) => {
    try {
      const listings = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name',
          'vendors.business_type'
        )
        .where('listings.is_active', true)
        .where('listings.is_featured', true)
        .where('listings.expiry_date', '>', new Date())
        .orderBy('listings.rescue_score', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: listings
      });
    } catch (error) {
      console.error('Get featured listings error:', error);
      throw createError('Failed to get featured listings', 500);
    }
  };

  getNearbyListings = async (req: Request, res: Response) => {
    try {
      const { latitude, longitude, radius = 10, page = 1, limit = 20 } = req.query;

      if (!latitude || !longitude) {
        throw createError('Location coordinates are required', 400);
      }

      const offset = (Number(page) - 1) * Number(limit);

      const listings = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name',
          'vendors.business_type',
          db.raw('ST_Distance(listings.location, ST_MakePoint(?, ?)) as distance')
        )
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date())
        .whereRaw('ST_DWithin(listings.location, ST_MakePoint(?, ?), ?)', [
          longitude, latitude, Number(radius) * 1000 // Convert km to meters
        ])
        .orderBy('distance', 'asc')
        .limit(Number(limit))
        .offset(offset);

      const total = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date())
        .whereRaw('ST_DWithin(listings.location, ST_MakePoint(?, ?), ?)', [
          longitude, latitude, Number(radius) * 1000
        ])
        .count('* as count')
        .first();

      res.json({
        success: true,
        data: listings,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: total?.count || 0,
          pages: Math.ceil(Number(total?.count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get nearby listings error:', error);
      throw createError('Failed to get nearby listings', 500);
    }
  };

  getListing = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const listing = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name',
          'vendors.business_type',
          'vendors.description as vendor_description',
          'vendors.phone as vendor_phone',
          'vendors.address as vendor_address'
        )
        .where('listings.id', id)
        .where('listings.is_active', true)
        .first();

      if (!listing) {
        throw createError('Listing not found', 404);
      }

      // Get similar listings
      const similarListings = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name'
        )
        .where('listings.category', listing.category)
        .where('listings.id', '!=', id)
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date())
        .limit(5);

      res.json({
        success: true,
        data: {
          ...listing,
          similarListings
        }
      });
    } catch (error) {
      console.error('Get listing error:', error);
      throw createError('Failed to get listing', 500);
    }
  };

  getSimilarListings = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const listing = await db('listings').where('id', id).first();

      if (!listing) {
        throw createError('Listing not found', 404);
      }

      const similarListings = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name'
        )
        .where('listings.category', listing.category)
        .where('listings.id', '!=', id)
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date())
        .orderBy('listings.rescue_score', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: similarListings
      });
    } catch (error) {
      console.error('Get similar listings error:', error);
      throw createError('Failed to get similar listings', 500);
    }
  };

  createListing = async (req: Request, res: Response) => {
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
      return;
    } catch (error) {
      console.error('Create listing error:', error);
      throw createError('Failed to create listing', 500);
    }
  };

  updateListing = async (req: Request, res: Response) => {
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
      const { id } = req.params;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const [updatedListing] = await db('listings')
        .where('id', id)
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
      return;
    } catch (error) {
      console.error('Update listing error:', error);
      throw createError('Failed to update listing', 500);
    }
  };

  deleteListing = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const vendor = await db('vendors').where('user_id', userId).first();

      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const deleted = await db('listings')
        .where('id', id)
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

  toggleFavorite = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const existingFavorite = await db('favorites')
        .where('user_id', userId)
        .where('listing_id', id)
        .first();

      if (existingFavorite) {
        await db('favorites')
          .where('user_id', userId)
          .where('listing_id', id)
          .del();

        res.json({
          success: true,
          message: 'Removed from favorites',
          isFavorite: false
        });
      } else {
        await db('favorites').insert({
          user_id: userId,
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

  getReviews = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      const reviews = await db('reviews')
        .join('users', 'reviews.user_id', 'users.id')
        .join('profiles', 'users.id', 'profiles.user_id')
        .select(
          'reviews.*',
          'profiles.first_name',
          'profiles.last_name'
        )
        .where('reviews.listing_id', id)
        .orderBy('reviews.created_at', 'desc')
        .limit(Number(limit))
        .offset(offset);

      const total = await db('reviews')
        .where('listing_id', id)
        .count('* as count')
        .first();

      res.json({
        success: true,
        data: reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: total?.count || 0,
          pages: Math.ceil(Number(total?.count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get reviews error:', error);
      throw createError('Failed to get reviews', 500);
    }
  };

  createReview = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const { rating, comment } = req.body;

      // Check if user has ordered this listing
      const hasOrdered = await db('order_items')
        .join('orders', 'order_items.order_id', 'orders.id')
        .where('order_items.listing_id', id)
        .where('orders.user_id', userId)
        .where('orders.status', 'delivered')
        .first();

      if (!hasOrdered) {
        throw createError('You can only review items you have purchased', 400);
      }

      // Check if user has already reviewed
      const existingReview = await db('reviews')
        .where('user_id', userId)
        .where('listing_id', id)
        .first();

      if (existingReview) {
        throw createError('You have already reviewed this item', 400);
      }

      const [newReview] = await db('reviews')
        .insert({
          user_id: userId,
          listing_id: id,
          rating,
          comment
        })
        .returning('*');

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: newReview
      });
    } catch (error) {
      console.error('Create review error:', error);
      throw createError('Failed to create review', 500);
    }
  };

  getCategories = async (req: Request, res: Response) => {
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

  getTrendingListings = async (req: Request, res: Response) => {
    try {
      const listings = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name'
        )
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date())
        .orderBy('listings.rescue_score', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: listings
      });
    } catch (error) {
      console.error('Get trending listings error:', error);
      throw createError('Failed to get trending listings', 500);
    }
  };

  getRescueDeals = async (req: Request, res: Response) => {
    try {
      const listings = await db('listings')
        .join('vendors', 'listings.vendor_id', 'vendors.id')
        .select(
          'listings.*',
          'vendors.business_name'
        )
        .where('listings.is_active', true)
        .where('listings.expiry_date', '>', new Date())
        .where('listings.rescue_score', '>=', 80)
        .orderBy('listings.rescue_score', 'desc')
        .limit(15);

      res.json({
        success: true,
        data: listings
      });
    } catch (error) {
      console.error('Get rescue deals error:', error);
      throw createError('Failed to get rescue deals', 500);
    }
  };
} 