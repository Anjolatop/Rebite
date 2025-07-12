import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { USSDController } from '../controllers/ussdController';

const router = Router();
const ussdController = new USSDController();

// Validation middleware
const validateUSSDRequest = [
  body('sessionId').trim().isLength({ min: 1 }).withMessage('Session ID is required'),
  body('phoneNumber').isMobilePhone('any').withMessage('Invalid phone number'),
  body('text').optional().trim().isLength({ max: 1000 }).withMessage('Text too long'),
  body('serviceCode').optional().trim().isLength({ min: 1 }).withMessage('Service code is required'),
];

const validateUSSDRegistration = [
  body('phoneNumber').isMobilePhone('any').withMessage('Invalid phone number'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('pin').isLength({ min: 4, max: 6 }).withMessage('PIN must be 4-6 digits'),
];

// Routes
router.post('/request', validateUSSDRequest, asyncHandler(ussdController.handleRequest));
router.post('/register', validateUSSDRegistration, asyncHandler(ussdController.registerUser));
router.post('/login', asyncHandler(ussdController.loginUser));
router.get('/menu', asyncHandler(ussdController.getMenu));
router.get('/listings', asyncHandler(ussdController.getListings));
router.get('/listings/:id', asyncHandler(ussdController.getListing));
router.post('/orders', asyncHandler(ussdController.createOrder));
router.get('/orders', asyncHandler(ussdController.getOrders));
router.get('/orders/:id', asyncHandler(ussdController.getOrder));
router.get('/points', asyncHandler(ussdController.getPoints));
router.post('/points/transfer', asyncHandler(ussdController.transferPoints));
router.post('/points/donate', asyncHandler(ussdController.donatePoints));
router.get('/goals', asyncHandler(ussdController.getGoals));
router.get('/profile', asyncHandler(ussdController.getProfile));
router.put('/profile', asyncHandler(ussdController.updateProfile));
router.get('/help', asyncHandler(ussdController.getHelp));
router.get('/settings', asyncHandler(ussdController.getSettings));
router.put('/settings', asyncHandler(ussdController.updateSettings));
router.get('/notifications', asyncHandler(ussdController.getNotifications));
router.post('/notifications/read', asyncHandler(ussdController.markNotificationsRead));
router.get('/search', asyncHandler(ussdController.searchListings));
router.get('/categories', asyncHandler(ussdController.getCategories));
router.get('/categories/:category', asyncHandler(ussdController.getListingsByCategory));
router.get('/nearby', asyncHandler(ussdController.getNearbyListings));
router.get('/favorites', asyncHandler(ussdController.getFavorites));
router.post('/favorites/:id', asyncHandler(ussdController.toggleFavorite));
router.get('/vendors', asyncHandler(ussdController.getVendors));
router.get('/vendors/:id', asyncHandler(ussdController.getVendor));
router.get('/deals', asyncHandler(ussdController.getDeals));
router.get('/recipes', asyncHandler(ussdController.getRecipes));
router.get('/recipes/:id', asyncHandler(ussdController.getRecipe));
router.post('/feedback', asyncHandler(ussdController.submitFeedback));

export default router; 