// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
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

// Member Types
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
  joinDate: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from joins
  membershipEndDate?: string;
  currentPlan?: string;
}

export interface CreateMemberRequest {
  name: string;
  email: string;
  phone: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  planId: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
  discount?: number;
}

// Plan Types
export interface MembershipPlan {
  id: string;
  name: string;
  duration: number; // in months
  price: number;
  freezeDays: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface PaymentRecord {
  id: string;
  memberId: string;
  membershipId: string;
  amount: number;
  method: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionId?: string;
  notes?: string;
  processedBy: string;
  createdAt: string;
  updatedAt: string;
}

// Membership Types
export interface Membership {
  id: string;
  memberId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'suspended' | 'frozen';
  freezeDaysUsed: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

// Check-in Types
export interface CheckIn {
  id: string;
  memberId: string;
  checkInTime: string;
  checkOutTime?: string;
  notes?: string;
  createdAt: string;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}