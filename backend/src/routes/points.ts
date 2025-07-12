import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { PointsController } from '../controllers/pointsController';

const router = Router();
const pointsController = new PointsController();

// Validation middleware
const validatePointsTransfer = [
  body('recipientId').isUUID().withMessage('Invalid recipient ID'),
  body('amount').isInt({ min: 1 }).withMessage('Amount must be at least 1 point'),
  body('message').optional().trim().isLength({ max: 200 }).withMessage('Message too long'),
];

const validatePointsDonation = [
  body('charityId').isUUID().withMessage('Invalid charity ID'),
  body('amount').isInt({ min: 1 }).withMessage('Amount must be at least 1 point'),
  body('anonymous').optional().isBoolean().withMessage('Anonymous must be a boolean'),
];

const validateRewardRedemption = [
  body('rewardId').isUUID().withMessage('Invalid reward ID'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

// Routes
router.get('/balance', asyncHandler(pointsController.getBalance));
router.get('/history', asyncHandler(pointsController.getHistory));
router.get('/earned', asyncHandler(pointsController.getEarnedPoints));
router.get('/spent', asyncHandler(pointsController.getSpentPoints));
router.get('/streaks', asyncHandler(pointsController.getStreaks));
router.get('/achievements', asyncHandler(pointsController.getAchievements));
router.get('/leaderboard', asyncHandler(pointsController.getLeaderboard));
router.get('/rewards', asyncHandler(pointsController.getRewards));
router.get('/rewards/:id', asyncHandler(pointsController.getReward));
router.post('/rewards/:id/redeem', validateRewardRedemption, asyncHandler(pointsController.redeemReward));
router.post('/transfer', validatePointsTransfer, asyncHandler(pointsController.transferPoints));
router.post('/donate', validatePointsDonation, asyncHandler(pointsController.donatePoints));
router.get('/charities', asyncHandler(pointsController.getCharities));
router.get('/challenges', asyncHandler(pointsController.getChallenges));
router.post('/challenges/:id/join', asyncHandler(pointsController.joinChallenge));
router.get('/challenges/:id/progress', asyncHandler(pointsController.getChallengeProgress));
router.get('/referrals', asyncHandler(pointsController.getReferrals));
router.post('/referrals/generate', asyncHandler(pointsController.generateReferralCode));
router.post('/referrals/:code/use', asyncHandler(pointsController.useReferralCode));
router.get('/analytics', asyncHandler(pointsController.getPointsAnalytics));
router.get('/goals', asyncHandler(pointsController.getGoals));
router.post('/goals', asyncHandler(pointsController.createGoal));
router.put('/goals/:id', asyncHandler(pointsController.updateGoal));
router.delete('/goals/:id', asyncHandler(pointsController.deleteGoal));

export default router; 