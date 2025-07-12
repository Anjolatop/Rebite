import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

// Validation middleware
const validateProfileUpdate = [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name must not be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name must not be empty'),
  body('phone').optional().isMobilePhone('any', { strictMode: true }).withMessage('Invalid phone number'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender'),
];

const validatePreferences = [
  body('dietaryPreferences').optional().isArray().withMessage('Dietary preferences must be an array'),
  body('allergies').optional().isArray().withMessage('Allergies must be an array'),
  body('nutritionGoals').optional().isArray().withMessage('Nutrition goals must be an array'),
  body('sustainabilityValues').optional().isArray().withMessage('Sustainability values must be an array'),
];

const validateLocation = [
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('address').optional().trim().isLength({ min: 1 }).withMessage('Address is required'),
  body('city').optional().trim().isLength({ min: 1 }).withMessage('City is required'),
  body('state').optional().trim().isLength({ min: 1 }).withMessage('State is required'),
  body('zipCode').optional().trim().isLength({ min: 1 }).withMessage('ZIP code is required'),
];

// Routes
router.get('/profile', asyncHandler(userController.getProfile));
router.put('/profile', validateProfileUpdate, asyncHandler(userController.updateProfile));
router.get('/preferences', asyncHandler(userController.getPreferences));
router.put('/preferences', validatePreferences, asyncHandler(userController.updatePreferences));
router.get('/location', asyncHandler(userController.getLocation));
router.put('/location', validateLocation, asyncHandler(userController.updateLocation));
router.get('/goals', asyncHandler(userController.getGoals));
router.put('/goals', asyncHandler(userController.updateGoals));
router.get('/values', asyncHandler(userController.getValueProgress));
router.get('/points', asyncHandler(userController.getPointsHistory));
router.get('/streaks', asyncHandler(userController.getStreaks));
router.post('/sync-fitness', asyncHandler(userController.syncFitnessData));

export default router; 