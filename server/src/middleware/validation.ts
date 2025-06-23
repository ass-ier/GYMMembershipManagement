import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '@/types';

export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors: Record<string, string> = {};
      error.details.forEach(detail => {
        const key = detail.path.join('.');
        errors[key] = detail.message;
      });

      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        errors
      };
      
      res.status(400).json(response);
      return;
    }

    // Replace the original data with validated and sanitized data
    req[property] = value;
    next();
  };
};