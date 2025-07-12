import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { OrderController } from '../controllers/orderController';

const router = Router();
const orderController = new OrderController();

// Validation middleware
const validateCreateOrder = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.listingId').isUUID().withMessage('Invalid listing ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress').isObject().withMessage('Delivery address is required'),
  body('deliveryAddress.address').trim().isLength({ min: 1 }).withMessage('Address is required'),
  body('deliveryAddress.city').trim().isLength({ min: 1 }).withMessage('City is required'),
  body('deliveryAddress.state').trim().isLength({ min: 1 }).withMessage('State is required'),
  body('deliveryAddress.zipCode').trim().isLength({ min: 1 }).withMessage('ZIP code is required'),
  body('deliveryAddress.latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('deliveryAddress.longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('deliveryInstructions').optional().trim().isLength({ max: 500 }).withMessage('Delivery instructions too long'),
  body('paymentMethod').isIn(['card', 'points', 'ebt', 'mixed']).withMessage('Invalid payment method'),
  body('usePoints').optional().isBoolean().withMessage('usePoints must be a boolean'),
  body('pointsToUse').optional().isInt({ min: 0 }).withMessage('Points must be a positive number'),
];

const validateOrderUpdate = [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']).withMessage('Invalid order status'),
  body('estimatedDeliveryTime').optional().isISO8601().withMessage('Invalid delivery time format'),
  body('trackingNumber').optional().trim().isLength({ min: 1 }).withMessage('Tracking number is required'),
];

const validatePayment = [
  body('paymentMethod').isIn(['card', 'points', 'ebt', 'mixed']).withMessage('Invalid payment method'),
  body('paymentToken').optional().trim().isLength({ min: 1 }).withMessage('Payment token is required'),
  body('pointsToUse').optional().isInt({ min: 0 }).withMessage('Points must be a positive number'),
];

// Routes
router.get('/', asyncHandler(orderController.getOrders));
router.get('/:id', asyncHandler(orderController.getOrder));
router.post('/', validateCreateOrder, asyncHandler(orderController.createOrder));
router.put('/:id', validateOrderUpdate, asyncHandler(orderController.updateOrder));
router.delete('/:id', asyncHandler(orderController.cancelOrder));
router.post('/:id/pay', validatePayment, asyncHandler(orderController.processPayment));
router.get('/:id/tracking', asyncHandler(orderController.getTrackingInfo));
router.post('/:id/track', asyncHandler(orderController.updateTracking));
router.get('/:id/status', asyncHandler(orderController.getOrderStatus));
router.post('/:id/rate', asyncHandler(orderController.rateOrder));
router.get('/:id/receipt', asyncHandler(orderController.getReceipt));
router.post('/:id/dispute', asyncHandler(orderController.createDispute));
router.get('/:id/disputes', asyncHandler(orderController.getDisputes));
router.get('/analytics', asyncHandler(orderController.getOrderAnalytics));
router.get('/pending', asyncHandler(orderController.getPendingOrders));
router.get('/completed', asyncHandler(orderController.getCompletedOrders));

export default router; 