import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { VendorController } from '../controllers/vendorController';

const router = Router();
const vendorController = new VendorController();

// Validation middleware
const validateVendorProfile = [
  body('businessName').trim().isLength({ min: 1 }).withMessage('Business name is required'),
  body('businessType').isIn(['farmer', 'restaurant', 'bakery', 'grocery']).withMessage('Invalid business type'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('phone').isMobilePhone('any').withMessage('Invalid phone number'),
  body('address').trim().isLength({ min: 1 }).withMessage('Address is required'),
  body('city').trim().isLength({ min: 1 }).withMessage('City is required'),
  body('state').trim().isLength({ min: 1 }).withMessage('State is required'),
  body('zipCode').trim().isLength({ min: 1 }).withMessage('ZIP code is required'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
];

const validateBusinessHours = [
  body('hours').isArray().withMessage('Business hours must be an array'),
  body('hours.*.day').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).withMessage('Invalid day'),
  body('hours.*.open').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('hours.*.close').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('hours.*.isOpen').isBoolean().withMessage('isOpen must be a boolean'),
];

const validatePaymentInfo = [
  body('stripeAccountId').optional().trim().isLength({ min: 1 }).withMessage('Stripe account ID is required'),
  body('bankAccount').optional().isObject().withMessage('Bank account must be an object'),
  body('taxId').optional().trim().isLength({ min: 1 }).withMessage('Tax ID is required'),
];

// Routes
router.get('/profile', asyncHandler(vendorController.getProfile));
router.put('/profile', validateVendorProfile, asyncHandler(vendorController.updateProfile));
router.get('/dashboard', asyncHandler(vendorController.getDashboard));
router.get('/analytics', asyncHandler(vendorController.getAnalytics));
router.get('/orders', asyncHandler(vendorController.getOrders));
router.put('/orders/:orderId/status', asyncHandler(vendorController.updateOrderStatus));
router.get('/listings', asyncHandler(vendorController.getListings));
router.post('/listings', asyncHandler(vendorController.createListing));
router.put('/listings/:listingId', asyncHandler(vendorController.updateListing));
router.delete('/listings/:listingId', asyncHandler(vendorController.deleteListing));
router.put('/business-hours', validateBusinessHours, asyncHandler(vendorController.updateBusinessHours));
router.get('/business-hours', asyncHandler(vendorController.getBusinessHours));
router.put('/payment-info', validatePaymentInfo, asyncHandler(vendorController.updatePaymentInfo));
router.get('/payment-info', asyncHandler(vendorController.getPaymentInfo));
router.post('/verification', asyncHandler(vendorController.submitVerification));
router.get('/verification-status', asyncHandler(vendorController.getVerificationStatus));
router.get('/earnings', asyncHandler(vendorController.getEarnings));
router.get('/customers', asyncHandler(vendorController.getCustomers));

export default router; 