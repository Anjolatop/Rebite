import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: true, message: 'No token provided' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, secret) as any;
    
    // Check if user still exists and is active
    const user = await db('users')
      .select('id', 'email', 'role', 'is_active')
      .where('id', decoded.userId)
      .first();

    if (!user) {
      return res.status(401).json({ error: true, message: 'User not found' });
    }

    if (!user.is_active) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'User not found or account inactive'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: 'An error occurred during authentication'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: 'You do not have permission to access this resource'
      });
    }

    return next();
  };
};

export const requireVendor = requireRole(['vendor', 'admin']);
export const requireAdmin = requireRole(['admin']);

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continue without authentication
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(); // Continue without authentication
    }

    const decoded = jwt.verify(token, secret) as any;
    
    const user = await db('users')
      .select('id', 'email', 'role', 'is_active')
      .where('id', decoded.userId)
      .first();

    if (user && user.is_active) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };
    }

    return next();
  } catch (error) {
    // Continue without authentication on error
    return next();
  }
}; 