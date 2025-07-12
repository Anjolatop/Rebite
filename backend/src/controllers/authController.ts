import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { createError } from '../middleware/errorHandler';
import { EmailService } from '../services/emailService';

export class AuthController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: true, 
        message: 'Validation failed',
        errors: errors.array() 
      });
      return;
    }

    const { email, password, firstName, lastName, role = 'consumer' } = req.body;

    try {
      // Check if user already exists
      const existingUser = await db('users').where('email', email).first();
      if (existingUser) {
        res.status(400).json({
          error: true,
          message: 'User with this email already exists'
        });
        return;
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create verification token
      const verificationToken = uuidv4();

      // Create user
      const [user] = await db('users').insert({
        email,
        password_hash: passwordHash,
        role,
        verification_token: verificationToken
      }).returning(['id', 'email', 'role', 'verification_token']);

      // Create profile
      await db('profiles').insert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName
      });

      // Send verification email
      await this.emailService.sendVerificationEmail(user.email, verificationToken);

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user.id);

      res.status(201).json({
        message: 'User registered successfully. Please check your email for verification.',
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw createError('Failed to register user', 500);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: true, 
        message: 'Validation failed',
        errors: errors.array() 
      });
      return;
    }

    const { email, password } = req.body;

    try {
      // Find user
      const user = await db('users')
        .select('id', 'email', 'password_hash', 'role', 'is_active', 'email_verified')
        .where('email', email)
        .first();

      if (!user) {
        res.status(401).json({
          error: true,
          message: 'Invalid email or password'
        });
        return;
      }

      if (!user.is_active) {
        res.status(401).json({
          error: true,
          message: 'Account is deactivated'
        });
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        res.status(401).json({
          error: true,
          message: 'Invalid email or password'
        });
        return;
      }

      // Update last login
      await db('users')
        .where('id', user.id)
        .update({ last_login: new Date() });

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user.id);

      // Get user profile
      const profile = await db('profiles')
        .select('first_name', 'last_name', 'total_points', 'streak_days')
        .where('user_id', user.id)
        .first();

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          emailVerified: user.email_verified,
          firstName: profile?.first_name,
          lastName: profile?.last_name,
          totalPoints: profile?.total_points || 0,
          streakDays: profile?.streak_days || 0
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      throw createError('Failed to authenticate user', 500);
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        error: true,
        message: 'Refresh token is required'
      });
      return;
    }

    try {
      const secret = process.env.JWT_REFRESH_SECRET;
      if (!secret) {
        throw createError('JWT refresh secret not configured', 500);
      }

      const decoded = jwt.verify(refreshToken, secret) as any;
      
      // Check if user exists and is active
      const user = await db('users')
        .select('id', 'email', 'role', 'is_active')
        .where('id', decoded.userId)
        .first();

      if (!user || !user.is_active) {
        res.status(401).json({
          error: true,
          message: 'Invalid refresh token'
        });
        return;
      }

      // Generate new tokens
      const tokens = this.generateTokens(user.id);

      res.json({
        message: 'Token refreshed successfully',
        tokens
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        error: true,
        message: 'Invalid refresh token'
      });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // In a real implementation, you might want to blacklist the token
      res.json({
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw createError('Failed to logout', 500);
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: true, 
        message: 'Validation failed',
        errors: errors.array() 
      });
      return;
    }

    const { email } = req.body;

    try {
      const user = await db('users').where('email', email).first();
      
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      // Generate reset token
      const resetToken = uuidv4();
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update user with reset token
      await db('users')
        .where('id', user.id)
        .update({
          reset_token: resetToken,
          reset_token_expiry: resetTokenExpiry
        });

      // Send reset email
      await this.emailService.sendPasswordResetEmail(user.email, resetToken);

      res.json({
        message: 'Password reset email sent successfully'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw createError('Failed to process password reset request', 500);
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: true, 
        message: 'Validation failed',
        errors: errors.array() 
      });
      return;
    }

    const { token, password } = req.body;

    try {
      const user = await db('users')
        .where('reset_token', token)
        .where('reset_token_expiry', '>', new Date())
        .first();

      if (!user) {
        res.status(400).json({
          error: true,
          message: 'Invalid or expired reset token'
        });
        return;
      }

      // Hash new password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Update user password and clear reset token
      await db('users')
        .where('id', user.id)
        .update({
          password_hash: passwordHash,
          reset_token: null,
          reset_token_expiry: null
        });

      res.json({
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw createError('Failed to reset password', 500);
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    try {
      const user = await db('users')
        .where('verification_token', token)
        .first();

      if (!user) {
        res.status(400).json({
          error: true,
          message: 'Invalid verification token'
        });
        return;
      }

      // Update user as verified
      await db('users')
        .where('id', user.id)
        .update({
          email_verified: true,
          verification_token: null
        });

      res.json({
        message: 'Email verified successfully'
      });
    } catch (error) {
      console.error('Email verification error:', error);
      throw createError('Failed to verify email', 500);
    }
  };

  resendVerification = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
      const user = await db('users').where('email', email).first();
      
      if (!user) {
        res.status(404).json({
          error: true,
          message: 'User not found'
        });
        return;
      }

      if (user.email_verified) {
        res.status(400).json({
          error: true,
          message: 'Email is already verified'
        });
        return;
      }

      // Generate new verification token
      const verificationToken = uuidv4();

      // Update user with new verification token
      await db('users')
        .where('id', user.id)
        .update({
          verification_token: verificationToken
        });

      // Send verification email
      await this.emailService.sendVerificationEmail(user.email, verificationToken);

      res.json({
        message: 'Verification email sent successfully'
      });
    } catch (error) {
      console.error('Resend verification error:', error);
      throw createError('Failed to resend verification email', 500);
    }
  };

  private generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
} 