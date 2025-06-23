import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '@/utils/auth';
import { ApiResponse } from '@/types';
import { logger } from '@/utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse = {
        success: false,
        error: 'Access token required'
      };
      res.status(401).json(response);
      return;
    }

    const token = authHeader.substring(7);
    
    try {
      const payload = AuthUtils.verifyAccessToken(token);
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      };
      next();
    } catch (error) {
      logger.warn('Invalid access token', { token: token.substring(0, 10) + '...' });
      const response: ApiResponse = {
        success: false,
        error: 'Invalid or expired token'
      };
      res.status(401).json(response);
    }
  } catch (error) {
    logger.error('Authentication middleware error', error);
    const response: ApiResponse = {
      success: false,
      error: 'Authentication failed'
    };
    res.status(500).json(response);
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: 'Authentication required'
      };
      res.status(401).json(response);
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Unauthorized access attempt', {
        userId: req.user.userId,
        role: req.user.role,
        requiredRoles: roles,
        path: req.path
      });
      
      const response: ApiResponse = {
        success: false,
        error: 'Insufficient permissions'
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      const payload = AuthUtils.verifyAccessToken(token);
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      };
    } catch (error) {
      // Token is invalid, but we continue without authentication
      logger.debug('Optional auth failed', error);
    }
  }
  
  next();
};