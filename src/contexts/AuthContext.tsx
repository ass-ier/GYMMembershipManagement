import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/api/auth';

export type UserRole = 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permission mapping - Manager now has full access like admin did
const rolePermissions: Record<UserRole, string[]> = {
  manager: ['*'], // Full access (same as admin had)
  staff: [
    'dashboard.view',
    'members.view', 'members.edit',
    'payments.view', 'payments.edit',
    'checkin.view', 'checkin.manage'
  ]
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for stored user session and validate token
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('fittrack-user');
      const token = localStorage.getItem('fittrack-token');
      
      if (storedUser && token) {
        try {
          // Validate token by fetching profile
          const response = await authAPI.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem('fittrack-user', JSON.stringify(response.data));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('fittrack-user');
            localStorage.removeItem('fittrack-token');
            localStorage.removeItem('fittrack-refresh-token');
          }
        } catch (error) {
          // Token validation failed, try to refresh
          try {
            const refreshResponse = await authAPI.refreshToken();
            if (refreshResponse.success) {
              // Retry getting profile with new token
              const profileResponse = await authAPI.getProfile();
              if (profileResponse.success && profileResponse.data) {
                setUser(profileResponse.data);
                localStorage.setItem('fittrack-user', JSON.stringify(profileResponse.data));
              }
            } else {
              // Refresh failed, clear storage
              localStorage.removeItem('fittrack-user');
              localStorage.removeItem('fittrack-token');
              localStorage.removeItem('fittrack-refresh-token');
            }
          } catch (refreshError) {
            // Clear storage on any error
            localStorage.removeItem('fittrack-user');
            localStorage.removeItem('fittrack-token');
            localStorage.removeItem('fittrack-refresh-token');
          }
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      if (response.success && response.data) {
        setUser(response.data.user);
        localStorage.setItem('fittrack-user', JSON.stringify(response.data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(user.id, data);
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('fittrack-user', JSON.stringify(response.data));
      }
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      await authAPI.changePassword(user.id, oldPassword, newPassword);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = rolePermissions[user.role];
    if (!userPermissions) return false;
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateProfile,
      changePassword,
      isAuthenticated: !!user,
      hasPermission,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};