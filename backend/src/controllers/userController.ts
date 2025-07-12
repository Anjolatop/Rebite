import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { createError } from '../middleware/errorHandler';

export class UserController {
  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const profile = await db('profiles')
        .select('*')
        .where('user_id', userId)
        .first();

      if (!profile) {
        throw createError('Profile not found', 404);
      }

      res.json({
        success: true,
        data: profile
      });
      return;
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ success: false, message: 'Failed to get profile' });
      return;
    }
  };

  updateProfile = async (req: Request, res: Response) => {
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
      const updateData = req.body;

      const [updatedProfile] = await db('profiles')
        .where('user_id', userId)
        .update(updateData)
        .returning('*');

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile
      });
      return;
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ success: false, message: 'Failed to update profile' });
      return;
    }
  };

  getPreferences = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const preferences = await db('user_preferences')
        .select('*')
        .where('user_id', userId)
        .first();

      res.json({
        success: true,
        data: preferences || {}
      });
      return;
    } catch (error) {
      console.error('Get preferences error:', error);
      res.status(500).json({ success: false, message: 'Failed to get preferences' });
      return;
    }
  };

  updatePreferences = async (req: Request, res: Response) => {
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
      const preferences = req.body;

      await db('user_preferences')
        .where('user_id', userId)
        .del();

      if (Object.keys(preferences).length > 0) {
        await db('user_preferences').insert({
          user_id: userId,
          ...preferences
        });
      }

      res.json({
        success: true,
        message: 'Preferences updated successfully'
      });
      return;
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({ success: false, message: 'Failed to update preferences' });
      return;
    }
  };

  getLocation = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const location = await db('user_locations')
        .select('*')
        .where('user_id', userId)
        .first();

      res.json({
        success: true,
        data: location || {}
      });
      return;
    } catch (error) {
      console.error('Get location error:', error);
      res.status(500).json({ success: false, message: 'Failed to get location' });
      return;
    }
  };

  updateLocation = async (req: Request, res: Response) => {
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
      const locationData = req.body;

      await db('user_locations')
        .where('user_id', userId)
        .del();

      await db('user_locations').insert({
        user_id: userId,
        ...locationData
      });

      res.json({
        success: true,
        message: 'Location updated successfully'
      });
      return;
    } catch (error) {
      console.error('Update location error:', error);
      res.status(500).json({ success: false, message: 'Failed to update location' });
      return;
    }
  };

  getGoals = async (req: Request, res: Response) => {
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
      return;
    } catch (error) {
      console.error('Get goals error:', error);
      res.status(500).json({ success: false, message: 'Failed to get goals' });
      return;
    }
  };

  updateGoals = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const goals = req.body.goals;

      // Delete existing goals
      await db('user_goals')
        .where('user_id', userId)
        .del();

      // Insert new goals
      if (goals && goals.length > 0) {
        const goalsToInsert = goals.map((goal: any) => ({
          user_id: userId,
          ...goal
        }));

        await db('user_goals').insert(goalsToInsert);
      }

      res.json({
        success: true,
        message: 'Goals updated successfully'
      });
      return;
    } catch (error) {
      console.error('Update goals error:', error);
      res.status(500).json({ success: false, message: 'Failed to update goals' });
      return;
    }
  };

  getValueProgress = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const valueProgress = await db('value_progress')
        .select('*')
        .where('user_id', userId)
        .first();

      res.json({
        success: true,
        data: valueProgress || {
          discipline: 0,
          mindfulness: 0,
          prudence: 0,
          empathy: 0
        }
      });
      return;
    } catch (error) {
      console.error('Get value progress error:', error);
      res.status(500).json({ success: false, message: 'Failed to get value progress' });
      return;
    }
  };

  getPointsHistory = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { page = 1, limit = 20 } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      const pointsHistory = await db('points_transactions')
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
        data: pointsHistory,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / Number(limit))
        }
      });
      return;
    } catch (error) {
      console.error('Get points history error:', error);
      res.status(500).json({ success: false, message: 'Failed to get points history' });
      return;
    }
  };

  getStreaks = async (req: Request, res: Response) => {
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
      return;
    } catch (error) {
      console.error('Get streaks error:', error);
      res.status(500).json({ success: false, message: 'Failed to get streaks' });
      return;
    }
  };

  syncFitnessData = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const fitnessData = req.body;

      // Store fitness data for AI recommendations
      await db('fitness_data').insert({
        user_id: userId,
        data: JSON.stringify(fitnessData),
        source: fitnessData.source || 'unknown'
      });

      res.json({
        success: true,
        message: 'Fitness data synced successfully'
      });
      return;
    } catch (error) {
      console.error('Sync fitness data error:', error);
      res.status(500).json({ success: false, message: 'Failed to sync fitness data' });
      return;
    }
  };
} 