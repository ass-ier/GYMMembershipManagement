export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'manager' | 'staff';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  memberNumber: string;
  avatar?: string;
  status: 'active' | 'expired' | 'suspended' | 'frozen';
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration: number; // in months
  price: number;
  freezeDays: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  memberId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'suspended' | 'frozen';
  freezeDaysUsed: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  memberId: string;
  membershipId: string;
  amount: number;
  method: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionId?: string;
  notes?: string;
  processedBy: string; // user ID
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckIn {
  id: string;
  memberId: string;
  checkInTime: Date;
  checkOutTime?: Date;
  notes?: string;
  createdAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}