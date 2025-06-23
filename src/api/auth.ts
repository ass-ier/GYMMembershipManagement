import { apiCall } from './config';
import { ApiResponse } from './types';
import { User } from '@/contexts/AuthContext';

export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>> => {
    try {
      const response = await apiCall<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );
      
      // Store tokens if login successful
      if (response.success && response.data) {
        localStorage.setItem('fittrack-token', response.data.tokens.accessToken);
        localStorage.setItem('fittrack-refresh-token', response.data.tokens.refreshToken);
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>> => {
    try {
      const response = await apiCall<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>>(
        '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(userData),
        }
      );
      
      // Store tokens if registration successful
      if (response.success && response.data) {
        localStorage.setItem('fittrack-token', response.data.tokens.accessToken);
        localStorage.setItem('fittrack-refresh-token', response.data.tokens.refreshToken);
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  },

  logout: async (): Promise<ApiResponse<boolean>> => {
    try {
      const refreshToken = localStorage.getItem('fittrack-refresh-token');
      
      await apiCall('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      
      // Clear tokens
      localStorage.removeItem('fittrack-token');
      localStorage.removeItem('fittrack-refresh-token');
      localStorage.removeItem('fittrack-user');
      
      return {
        success: true,
        data: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      // Clear tokens even if logout fails
      localStorage.removeItem('fittrack-token');
      localStorage.removeItem('fittrack-refresh-token');
      localStorage.removeItem('fittrack-user');
      
      return {
        success: false,
        data: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      };
    }
  },

  refreshToken: async (): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    try {
      const refreshToken = localStorage.getItem('fittrack-refresh-token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiCall<ApiResponse<{ accessToken: string; refreshToken: string }>>(
        '/auth/refresh-token',
        {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        }
      );
      
      // Update tokens if refresh successful
      if (response.success && response.data) {
        localStorage.setItem('fittrack-token', response.data.accessToken);
        localStorage.setItem('fittrack-refresh-token', response.data.refreshToken);
      }
      
      return response;
    } catch (error) {
      // Clear tokens if refresh fails
      localStorage.removeItem('fittrack-token');
      localStorage.removeItem('fittrack-refresh-token');
      localStorage.removeItem('fittrack-user');
      
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Token refresh failed'
      };
    }
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiCall<ApiResponse<User>>('/auth/profile');
      return response;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get profile'
      };
    }
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await apiCall<ApiResponse<User>>(
        '/auth/profile',
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );
      return response;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<ApiResponse<boolean>> => {
    try {
      const response = await apiCall<ApiResponse<boolean>>(
        '/auth/change-password',
        {
          method: 'PUT',
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );
      return response;
    } catch (error) {
      return {
        success: false,
        data: false,
        error: error instanceof Error ? error.message : 'Failed to change password'
      };
    }
  }
};