
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute = ({ children, permission, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return null; // This will be handled by the main App component
  }

  if (permission && !hasPermission(permission)) {
    return fallback || (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access this feature.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
