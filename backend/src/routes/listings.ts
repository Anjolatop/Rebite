import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { ListingController } from '../controllers/listingController';

const router = Router();
const listingController = new ListingController();

// Validation middleware
const validateListing = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['produce', 'dairy', 'meat', 'bakery', 'prepared-food', 'pantry', 'beverages']).withMessage('Invalid category'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('originalPrice').optional().isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('unit').isIn(['piece', 'pound', 'ounce', 'gram', 'kilogram', 'liter', 'gallon', 'dozen', 'bunch']).withMessage('Invalid unit'),
  body('expiryDate').isISO8601().withMessage('Invalid expiry date format'),
  body('nutritionalInfo').optional().isObject().withMessage('Nutritional info must be an object'),
  body('ingredients').optional().isArray().withMessage('Ingredients must be an array'),
  body('allergens').optional().isArray().withMessage('Allergens must be an array'),
  body('dietaryTags').optional().isArray().withMessage('Dietary tags must be an array'),
  body('rescueScore').optional().isInt({ min: 1, max: 100 }).withMessage('Rescue score must be between 1 and 100'),
  body('images').optional().isArray().withMessage('Images must be an array'),
];

const validateSearch = [
  body('query').optional().trim().isLength({ min: 1 }).withMessage('Search query must not be empty'),
  body('category').optional().isIn(['produce', 'dairy', 'meat', 'bakery', 'prepared-food', 'pantry', 'beverages']).withMessage('Invalid category'),
  body('priceRange').optional().isObject().withMessage('Price range must be an object'),
  body('distance').optional().isFloat({ min: 0 }).withMessage('Distance must be a positive number'),
  body('dietaryPreferences').optional().isArray().withMessage('Dietary preferences must be an array'),
  body('allergies').optional().isArray().withMessage('Allergies must be an array'),
  body('sortBy').optional().isIn(['price', 'distance', 'expiry', 'rescueScore', 'rating']).withMessage('Invalid sort option'),
  body('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Invalid sort order'),
];

// Routes
router.get('/', asyncHandler(listingController.getListings));
router.get('/search', asyncHandler(listingController.searchListings));
router.get('/featured', asyncHandler(listingController.getFeaturedListings));
router.get('/nearby', asyncHandler(listingController.getNearbyListings));
router.get('/:id', asyncHandler(listingController.getListing));
router.get('/:id/similar', asyncHandler(listingController.getSimilarListings));
router.post('/', validateListing, asyncHandler(listingController.createListing));
router.put('/:id', validateListing, asyncHandler(listingController.updateListing));
router.delete('/:id', asyncHandler(listingController.deleteListing));
router.post('/:id/favorite', asyncHandler(listingController.toggleFavorite));
router.get('/:id/reviews', asyncHandler(listingController.getReviews));
router.post('/:id/reviews', asyncHandler(listingController.createReview));
router.get('/categories', asyncHandler(listingController.getCategories));
router.get('/trending', asyncHandler(listingController.getTrendingListings));
router.get('/rescue-deals', asyncHandler(listingController.getRescueDeals));

export default router; 