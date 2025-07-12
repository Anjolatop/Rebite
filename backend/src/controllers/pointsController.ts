import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { createError } from '../middleware/errorHandler';

export class PointsController {
  getBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const profile = await db('profiles')
        .select('total_points')
        .where('user_id', userId)
        .first();

      res.json({
        success: true,
        data: {
          balance: profile?.total_points || 0
        }
      });
    } catch (error) {
      console.error('Get balance error:', error);
      throw createError('Failed to get balance', 500);
    }
  };

  getHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { page = 1, limit = 20 } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      const history = await db('points_transactions')
        .select('*')
        .where('user_id', userId)
        .orderBy('created_at', 'desc')
        .limit(Number(limit))
        .offset(offset);

      const total = await db('points_transactions')
        .where('user_id', userId)
        .count('* as count')
        .first();

      const totalCount = Number(total?.count) || 0;
      res.json({
        success: true,
        data: history,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get history error:', error);
      throw createError('Failed to get history', 500);
    }
  };

  getEarnedPoints = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const earned = await db('points_transactions')
        .sum('amount as total')
        .where('user_id', userId)
        .where('amount', '>', 0)
        .first();

      const spent = await db('points_transactions')
        .sum(db.raw('ABS(amount) as sum'))
        .where('user_id', userId)
        .where('amount', '<', 0)
        .first();

      const earnedValue = earned ? Object.values(earned)[0] : 0;
      const spentValue = spent ? Object.values(spent)[0] : 0;
      res.json({
        success: true,
        earned: earnedValue,
        spent: spentValue
      });
    } catch (error) {
      console.error('Get earned points error:', error);
      throw createError('Failed to get earned points', 500);
    }
  };

  getSpentPoints = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const spent = await db('points_transactions')
        .sum(db.raw('ABS(amount) as total'))
        .where('user_id', userId)
        .where('amount', '<', 0)
        .first();

      const spentValue = spent ? Object.values(spent)[0] : 0;
      res.json({
        success: true,
        data: {
          spent: spentValue
        }
      });
    } catch (error) {
      console.error('Get spent points error:', error);
      throw createError('Failed to get spent points', 500);
    }
  };

  getStreaks = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const streaks = await db('user_streaks')
        .select('*')
        .where('user_id', userId)
        .first();

      res.json({
        success: true,
        data: streaks || {
          current_streak: 0,
          longest_streak: 0,
          last_activity: null
        }
      });
    } catch (error) {
      console.error('Get streaks error:', error);
      throw createError('Failed to get streaks', 500);
    }
  };

  getAchievements = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const achievements = await db('user_achievements')
        .select('*')
        .where('user_id', userId)
        .orderBy('earned_at', 'desc');

      res.json({
        success: true,
        data: achievements
      });
    } catch (error) {
      console.error('Get achievements error:', error);
      throw createError('Failed to get achievements', 500);
    }
  };

  getLeaderboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const leaderboard = await db('profiles')
        .select('user_id', 'first_name', 'last_name', 'total_points')
        .orderBy('total_points', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: leaderboard
      });
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw createError('Failed to get leaderboard', 500);
    }
  };

  getRewards = async (req: Request, res: Response): Promise<void> => {
    try {
      const rewards = await db('rewards')
        .select('*')
        .where('is_active', true)
        .orderBy('points_required', 'asc');

      res.json({
        success: true,
        data: rewards
      });
    } catch (error) {
      console.error('Get rewards error:', error);
      throw createError('Failed to get rewards', 500);
    }
  };

  getReward = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const reward = await db('rewards')
        .where('id', id)
        .first();

      if (!reward) {
        res.status(404).json({
          error: true,
          message: 'Reward not found'
        });
        return;
      }

      res.json({
        success: true,
        data: reward
      });
    } catch (error) {
      console.error('Get reward error:', error);
      throw createError('Failed to get reward', 500);
    }
  };

  redeemReward = async (req: Request, res: Response): Promise<void> => {
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
      const { id } = req.params;
      const { quantity = 1 } = req.body;

      const reward = await db('rewards')
        .where('id', id)
        .where('is_active', true)
        .first();

      if (!reward) {
        res.status(404).json({
          error: true,
          message: 'Reward not found'
        });
        return;
      }

      const userProfile = await db('profiles')
        .where('user_id', userId)
        .first();

      const totalCost = reward.points_required * quantity;

      if (!userProfile || userProfile.total_points < totalCost) {
        res.status(400).json({
          error: true,
          message: 'Insufficient points'
        });
        return;
      }

      // Deduct points
      await db('profiles')
        .where('user_id', userId)
        .decrement('total_points', totalCost);

      // Record transaction
      await db('points_transactions').insert({
        user_id: userId,
        type: 'spent',
        amount: -totalCost,
        description: `Redeemed ${quantity}x ${reward.title}`
      });

      // Create redemption record
      await db('reward_redemptions').insert({
        user_id: userId,
        reward_id: id,
        quantity,
        points_spent: totalCost
      });

      res.json({
        success: true,
        message: 'Reward redeemed successfully',
        data: {
          reward: reward.title,
          quantity,
          pointsSpent: totalCost
        }
      });
    } catch (error) {
      console.error('Redeem reward error:', error);
      throw createError('Failed to redeem reward', 500);
    }
  };

  transferPoints = async (req: Request, res: Response): Promise<void> => {
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
      const { recipientId, amount, message } = req.body;

      const userProfile = await db('profiles')
        .where('user_id', userId)
        .first();

      if (!userProfile || userProfile.total_points < amount) {
        res.status(400).json({
          error: true,
          message: 'Insufficient points'
        });
        return;
      }

      // Check if recipient exists
      const recipientProfile = await db('profiles')
        .where('user_id', recipientId)
        .first();

      if (!recipientProfile) {
        res.status(404).json({
          error: true,
          message: 'Recipient not found'
        });
        return;
      }

      // Transfer points
      await db('profiles')
        .where('user_id', userId)
        .decrement('total_points', amount);

      await db('profiles')
        .where('user_id', recipientId)
        .increment('total_points', amount);

      // Record transactions
      await db('points_transactions').insert([
        {
          user_id: userId,
          type: 'sent',
          amount: -amount,
          description: `Sent ${amount} points to user ${recipientId}${message ? `: ${message}` : ''}`
        },
        {
          user_id: recipientId,
          type: 'received',
          amount: amount,
          description: `Received ${amount} points from user ${userId}${message ? `: ${message}` : ''}`
        }
      ]);

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
      const { charityId, amount, anonymous } = req.body;

      const userProfile = await db('profiles')
        .where('user_id', userId)
        .first();

      if (!userProfile || userProfile.total_points < amount) {
        res.status(400).json({
          error: true,
          message: 'Insufficient points'
        });
        return;
      }

      // Check if charity exists
      const charity = await db('charities')
        .where('id', charityId)
        .first();

      if (!charity) {
        res.status(404).json({
          error: true,
          message: 'Charity not found'
        });
        return;
      }

      // Deduct points
      await db('profiles')
        .where('user_id', userId)
        .decrement('total_points', amount);

      // Record transaction
      await db('points_transactions').insert({
        user_id: userId,
        type: 'donated',
        amount: -amount,
        description: `Donated ${amount} points to ${charity.name}`
      });

      // Record donation
      await db('donations').insert({
        user_id: userId,
        charity_id: charityId,
        amount,
        anonymous
      });

      res.json({
        success: true,
        message: 'Points donated successfully'
      });
    } catch (error) {
      console.error('Donate points error:', error);
      throw createError('Failed to donate points', 500);
    }
  };

  getCharities = async (req: Request, res: Response): Promise<void> => {
    try {
      const charities = await db('charities')
        .select('*')
        .where('is_active', true)
        .orderBy('name');

      res.json({
        success: true,
        data: charities
      });
    } catch (error) {
      console.error('Get charities error:', error);
      throw createError('Failed to get charities', 500);
    }
  };

  getChallenges = async (req: Request, res: Response): Promise<void> => {
    try {
      const challenges = await db('challenges')
        .select('*')
        .where('is_active', true)
        .orderBy('created_at', 'desc');

      res.json({
        success: true,
        data: challenges
      });
    } catch (error) {
      console.error('Get challenges error:', error);
      throw createError('Failed to get challenges', 500);
    }
  };

  joinChallenge = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const challenge = await db('challenges')
        .where('id', id)
        .where('is_active', true)
        .first();

      if (!challenge) {
        res.status(404).json({
          error: true,
          message: 'Challenge not found'
        });
        return;
      }

      // Check if user already joined
      const existingParticipation = await db('challenge_participants')
        .where('challenge_id', id)
        .where('user_id', userId)
        .first();

      if (existingParticipation) {
        res.status(400).json({
          error: true,
          message: 'Already joined this challenge'
        });
        return;
      }

      // Join challenge
      await db('challenge_participants').insert({
        challenge_id: id,
        user_id: userId,
        progress: 0
      });

      res.json({
        success: true,
        message: 'Joined challenge successfully'
      });
    } catch (error) {
      console.error('Join challenge error:', error);
      throw createError('Failed to join challenge', 500);
    }
  };

  getChallengeProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const participation = await db('challenge_participants')
        .where('challenge_id', id)
        .where('user_id', userId)
        .first();

      if (!participation) {
        res.status(404).json({
          error: true,
          message: 'Not participating in this challenge'
        });
        return;
      }

      res.json({
        success: true,
        data: participation
      });
    } catch (error) {
      console.error('Get challenge progress error:', error);
      throw createError('Failed to get challenge progress', 500);
    }
  };

  getReferrals = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const referrals = await db('referrals')
        .select('*')
        .where('referrer_id', userId)
        .orderBy('created_at', 'desc');

      res.json({
        success: true,
        data: referrals
      });
    } catch (error) {
      console.error('Get referrals error:', error);
      throw createError('Failed to get referrals', 500);
    }
  };

  generateReferralCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const existingCode = await db('referral_codes')
        .where('user_id', userId)
        .first();

      if (existingCode) {
        res.json({
          success: true,
          data: {
            code: existingCode.code
          }
        });
        return;
      }

      // Generate unique code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      await db('referral_codes').insert({
        user_id: userId,
        code
      });

      res.json({
        success: true,
        data: {
          code
        }
      });
    } catch (error) {
      console.error('Generate referral code error:', error);
      throw createError('Failed to generate referral code', 500);
    }
  };

  useReferralCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { code } = req.params;

      const referralCode = await db('referral_codes')
        .where('code', code)
        .first();

      if (!referralCode) {
        res.status(404).json({
          error: true,
          message: 'Invalid referral code'
        });
        return;
      }

      if (referralCode.user_id === userId) {
        res.status(400).json({
          error: true,
          message: 'Cannot use your own referral code'
        });
        return;
      }

      // Check if already used
      const existingReferral = await db('referrals')
        .where('referrer_id', referralCode.user_id)
        .where('referred_id', userId)
        .first();

      if (existingReferral) {
        res.status(400).json({
          error: true,
          message: 'Referral code already used'
        });
        return;
      }

      // Award points to both users
      const pointsAwarded = 100;

      await db('profiles')
        .where('user_id', referralCode.user_id)
        .increment('total_points', pointsAwarded);

      await db('profiles')
        .where('user_id', userId)
        .increment('total_points', pointsAwarded);

      // Record transactions
      await db('points_transactions').insert([
        {
          user_id: referralCode.user_id,
          type: 'referral_bonus',
          amount: pointsAwarded,
          description: `Referral bonus for referring user ${userId}`
        },
        {
          user_id: userId,
          type: 'referral_bonus',
          amount: pointsAwarded,
          description: `Referral bonus for using code ${code}`
        }
      ]);

      // Record referral
      await db('referrals').insert({
        referrer_id: referralCode.user_id,
        referred_id: userId,
        code_used: code
      });

      res.json({
        success: true,
        message: 'Referral code used successfully',
        data: {
          pointsAwarded
        }
      });
    } catch (error) {
      console.error('Use referral code error:', error);
      throw createError('Failed to use referral code', 500);
    }
  };

  getPointsAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { period = '30' } = req.query;

      const analytics = await db('points_transactions')
        .select(
          db.raw('DATE(created_at) as date'),
          db.raw('SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as earned'),
          db.raw('SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as spent')
        )
        .where('user_id', userId)
        .whereRaw(`created_at >= NOW() - INTERVAL '${period} days'`)
        .groupByRaw('DATE(created_at)')
        .orderBy('date', 'asc');

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Get points analytics error:', error);
      throw createError('Failed to get points analytics', 500);
    }
  };

  getGoals = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const goals = await db('user_goals')
        .select('*')
        .where('user_id', userId)
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

  createGoal = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const goalData = req.body;

      const [newGoal] = await db('user_goals')
        .insert({
          user_id: userId,
          ...goalData
        })
        .returning('*');

      res.status(201).json({
        success: true,
        message: 'Goal created successfully',
        data: newGoal
      });
    } catch (error) {
      console.error('Create goal error:', error);
      throw createError('Failed to create goal', 500);
    }
  };

  updateGoal = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const updateData = req.body;

      const [updatedGoal] = await db('user_goals')
        .where('id', id)
        .where('user_id', userId)
        .update(updateData)
        .returning('*');

      if (!updatedGoal) {
        res.status(404).json({
          error: true,
          message: 'Goal not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Goal updated successfully',
        data: updatedGoal
      });
    } catch (error) {
      console.error('Update goal error:', error);
      throw createError('Failed to update goal', 500);
    }
  };

  deleteGoal = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const deleted = await db('user_goals')
        .where('id', id)
        .where('user_id', userId)
        .del();

      if (!deleted) {
        res.status(404).json({
          error: true,
          message: 'Goal not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Goal deleted successfully'
      });
    } catch (error) {
      console.error('Delete goal error:', error);
      throw createError('Failed to delete goal', 500);
    }
  };
} 