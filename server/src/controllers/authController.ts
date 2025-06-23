import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthUtils } from '@/utils/auth';
import { Helpers } from '@/utils/helpers';
import { ApiResponse, User, AuthTokens } from '@/types';
import { AuthenticatedRequest } from '@/middleware/auth';
import DatabaseConnection from '@/database/connection';
import { logger } from '@/utils/logger';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role = 'staff' } = req.body;
      const db = DatabaseConnection.getInstance();

      const existingUser = await db.get<{ id: string }>(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser) {
        const response: ApiResponse = {
          success: false,
          error: 'User with this email already exists'
        };
        res.status(409).json(response);
        return;
      }

      const hashedPassword = await AuthUtils.hashPassword(password);
      const userId = Helpers.generateId();

      await db.run(
        `INSERT INTO users (id, name, email, password, role)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, name, email, hashedPassword, role]
      );

      const tokens = await AuthUtils.generateTokens(userId, email, role);

      const user = await db.get<User>(
        `SELECT id, name, email, role, avatar, is_active as isActive, 
         last_login as lastLogin, created_at as createdAt, updated_at as updatedAt
         FROM users WHERE id = ?`,
        [userId]
      ) as User;

      logger.info('User registered successfully', { userId, email, role });

      const response: ApiResponse<{ user: User; tokens: AuthTokens }> = {
        success: true,
        data: { user, tokens },
        message: 'User registered successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Registration failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Registration failed'
      };
      res.status(500).json(response);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const db = DatabaseConnection.getInstance();

      const user = await db.get<User & { password: string }>(
        `SELECT id, name, email, password, role, avatar, is_active as isActive
         FROM users WHERE email = ? AND is_active = 1`,
        [email]
      );

      if (!user || !(await AuthUtils.comparePassword(password, user.password))) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid email or password'
        };
        res.status(401).json(response);
        return;
      }

      await db.run(
        'UPDATE users SET last_login = datetime("now") WHERE id = ?',
        [user.id]
      );

      const tokens = await AuthUtils.generateTokens(user.id, user.email, user.role);

      if ('password' in user) {
        delete user.password;
      }

      logger.info('User logged in successfully', { userId: user.id, email });

      const response: ApiResponse<{ user: User; tokens: AuthTokens }> = {
        success: true,
        data: { user: user as User, tokens },
        message: 'Login successful'
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Login failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Login failed'
      };
      res.status(500).json(response);
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        const response: ApiResponse = {
          success: false,
          error: 'Refresh token required'
        };
        res.status(400).json(response);
        return;
      }

      const payload = AuthUtils.verifyRefreshToken(refreshToken);

      const isValid = await AuthUtils.isRefreshTokenValid(refreshToken);
      if (!isValid) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid refresh token'
        };
        res.status(401).json(response);
        return;
      }

      const db = DatabaseConnection.getInstance();
      const user = await db.get<User>(
        `SELECT id, name, email, role FROM users WHERE id = ? AND is_active = 1`,
        [payload.userId]
      ) as User;

      if (!user) {
        const response: ApiResponse = {
          success: false,
          error: 'User not found'
        };
        res.status(404).json(response);
        return;
      }

      await AuthUtils.revokeRefreshToken(refreshToken);
      const tokens = await AuthUtils.generateTokens(user.id, user.email, user.role);

      const response: ApiResponse<AuthTokens> = {
        success: true,
        data: tokens,
        message: 'Token refreshed successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Token refresh failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Token refresh failed'
      };
      res.status(401).json(response);
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await AuthUtils.revokeRefreshToken(refreshToken);
      }

      logger.info('User logged out', { userId: req.user?.userId });

      const response: ApiResponse = {
        success: true,
        message: 'Logged out successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Logout failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Logout failed'
      };
      res.status(500).json(response);
    }
  }

  static async logoutAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (req.user) {
        await AuthUtils.revokeAllUserTokens(req.user.userId);
      }

      logger.info('User logged out from all devices', { userId: req.user?.userId });

      const response: ApiResponse = {
        success: true,
        message: 'Logged out from all devices successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Logout all failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Logout failed'
      };
      res.status(500).json(response);
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user!.userId;
      const db = DatabaseConnection.getInstance();

      const user = await db.get<{ password: string }>(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      ) as { password: string };

      if (!user || !(await AuthUtils.comparePassword(currentPassword, user.password))) {
        const response: ApiResponse = {
          success: false,
          error: 'Current password is incorrect'
        };
        res.status(400).json(response);
        return;
      }

      const hashedPassword = await AuthUtils.hashPassword(newPassword);
      await db.run(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
      );

      await AuthUtils.revokeAllUserTokens(userId);

      logger.info('Password changed successfully', { userId });

      const response: ApiResponse = {
        success: true,
        message: 'Password changed successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Password change failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Password change failed'
      };
      res.status(500).json(response);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const db = DatabaseConnection.getInstance();

      const user = await db.get<User>(
        `SELECT id, name, email, role, avatar, is_active as isActive,
         last_login as lastLogin, created_at as createdAt, updated_at as updatedAt
         FROM users WHERE id = ?`,
        [userId]
      ) as User;

      if (!user) {
        const response: ApiResponse = {
          success: false,
          error: 'User not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<User> = {
        success: true,
        data: user
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Get profile failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get profile'
      };
      res.status(500).json(response);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, email } = req.body;
      const userId = req.user!.userId;
      const db = DatabaseConnection.getInstance();

      if (email) {
        const existingUser = await db.get<{ id: string }>(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, userId]
        );

        if (existingUser) {
          const response: ApiResponse = {
            success: false,
            error: 'Email is already taken'
          };
          res.status(409).json(response);
          return;
        }
      }

      const updates: string[] = [];
      const values: any[] = [];

      if (name) {
        updates.push('name = ?');
        values.push(name);
      }

      if (email) {
        updates.push('email = ?');
        values.push(email);
      }

      if (updates.length > 0) {
        values.push(userId);
        await db.run(
          `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
      }

      const user = await db.get<User>(
        `SELECT id, name, email, role, avatar, is_active as isActive,
         last_login as lastLogin, created_at as createdAt, updated_at as updatedAt
         FROM users WHERE id = ?`,
        [userId]
      ) as User;

      logger.info('Profile updated successfully', { userId });

      const response: ApiResponse<User> = {
        success: true,
        data: user,
        message: 'Profile updated successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Profile update failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Profile update failed'
      };
      res.status(500).json(response);
    }
  }
}