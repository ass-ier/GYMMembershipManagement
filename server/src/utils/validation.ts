import Joi from 'joi';

// User validation schemas
export const userRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('manager', 'staff').default('staff')
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  role: Joi.string().valid('manager', 'staff'),
  isActive: Joi.boolean()
});

export const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(128).required()
});

// Member validation schemas
export const memberCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).required(),
  emergencyContactName: Joi.string().min(2).max(100).optional(),
  emergencyContactPhone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).optional(),
  planId: Joi.string().uuid().required(),
  paymentMethod: Joi.string().valid('cash', 'card', 'bank_transfer', 'mobile_money').required(),
  discount: Joi.number().min(0).max(100).default(0)
});

export const memberUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\+?[\d\s\-()]+$/),
  emergencyContactName: Joi.string().min(2).max(100).allow(''),
  emergencyContactPhone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).allow(''),
  status: Joi.string().valid('active', 'expired', 'suspended', 'frozen')
});

// Membership plan validation schemas
export const planCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  duration: Joi.number().integer().min(1).max(60).required(),
  price: Joi.number().positive().required(),
  freezeDays: Joi.number().integer().min(0).default(0),
  description: Joi.string().max(500).optional()
});

export const planUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  duration: Joi.number().integer().min(1).max(60),
  price: Joi.number().positive(),
  freezeDays: Joi.number().integer().min(0),
  description: Joi.string().max(500).allow(''),
  isActive: Joi.boolean()
});

// Payment validation schemas
export const paymentCreateSchema = Joi.object({
  memberId: Joi.string().uuid().required(),
  membershipId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  method: Joi.string().valid('cash', 'card', 'bank_transfer', 'mobile_money').required(),
  transactionId: Joi.string().optional(),
  notes: Joi.string().max(500).optional()
});

// Check-in validation schemas
export const checkInCreateSchema = Joi.object({
  memberId: Joi.string().uuid().required(),
  notes: Joi.string().max(500).optional()
});

// Query parameter validation schemas
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).optional(),
  status: Joi.string().optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

export const dateRangeSchema = Joi.object({
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate'))
});