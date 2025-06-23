import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { authLimiter } from '@/middleware/rateLimiter';
import { logActivity } from '@/middleware/activityLogger';
import {
  userRegistrationSchema,
  userLoginSchema,
  userUpdateSchema,
  passwordChangeSchema
} from '@/utils/validation';

const router = Router();

// Public routes
router.post('/register', 
  authLimiter,
  validate(userRegistrationSchema),
  AuthController.register
);

router.post('/login', 
  authLimiter,
  validate(userLoginSchema),
  AuthController.login
);

router.post('/refresh-token', 
  authLimiter,
  AuthController.refreshToken
);

// Protected routes
router.post('/logout', 
  authenticate,
  logActivity('logout', 'user'),
  AuthController.logout
);

router.post('/logout-all', 
  authenticate,
  logActivity('logout_all', 'user'),
  AuthController.logoutAll
);

router.get('/profile', 
  authenticate,
  AuthController.getProfile
);

router.put('/profile', 
  authenticate,
  validate(userUpdateSchema),
  logActivity('update_profile', 'user'),
  AuthController.updateProfile
);

router.put('/change-password', 
  authenticate,
  validate(passwordChangeSchema),
  logActivity('change_password', 'user'),
  AuthController.changePassword
);

export default router;