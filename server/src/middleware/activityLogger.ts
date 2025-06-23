import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import DatabaseConnection from '@/database/connection';
import { Helpers } from '@/utils/helpers';
import { logger } from '@/utils/logger';

export const logActivity = (action: string, entityType: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    // Store original res.json to intercept response
    const originalJson = res.json;
    
    res.json = function(body: any) {
      // Log activity after successful response
      if (req.user && body.success) {
        setImmediate(async () => {
          try {
            const db = DatabaseConnection.getInstance();
            const entityId = req.params.id || body.data?.id || 'unknown';
            const details = JSON.stringify({
              method: req.method,
              path: req.path,
              entityId,
              body: req.body
            });

            await db.run(
              `INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, details, ip_address, user_agent)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                Helpers.generateId(),
                req.user.userId,
                action,
                entityType,
                entityId,
                details,
                req.ip,
                req.get('User-Agent')
              ]
            );
          } catch (error) {
            logger.error('Failed to log activity', error);
          }
        });
      }
      
      return originalJson.call(this, body);
    };
    
    next();
  };
};