import { Router } from 'express';
import { MemberController } from '@/controllers/memberController';
import { authenticate, authorize } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { logActivity } from '@/middleware/activityLogger';
import {
  memberCreateSchema,
  memberUpdateSchema,
  paginationSchema
} from '@/utils/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get members with pagination and filtering
router.get('/',
  validate(paginationSchema, 'query'),
  MemberController.getMembers
);

// Search members
router.get('/search',
  MemberController.searchMembers
);

// Get specific member
router.get('/:id',
  MemberController.getMember
);

// Get member's memberships
router.get('/:id/memberships',
  MemberController.getMemberMemberships
);

// Create new member (staff and manager)
router.post('/',
  authorize(['staff', 'manager']),
  validate(memberCreateSchema),
  logActivity('create_member', 'member'),
  MemberController.createMember
);

// Update member (staff and manager)
router.put('/:id',
  authorize(['staff', 'manager']),
  validate(memberUpdateSchema),
  logActivity('update_member', 'member'),
  MemberController.updateMember
);

// Delete member (manager only)
router.delete('/:id',
  authorize(['manager']),
  logActivity('delete_member', 'member'),
  MemberController.deleteMember
);

export default router;