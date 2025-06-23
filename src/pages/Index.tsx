
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import MemberManagement from '@/components/MemberManagement';
import CheckInSystem from '@/components/CheckInSystem';
import PaymentsBilling from '@/components/PaymentsBilling';
import Reports from '@/components/Reports';
import Settings from '@/components/Settings';
import StaffManagement from '@/components/StaffManagement';
import WelcomeDashboard from '@/components/WelcomeDashboard';
import ProfileSettings from '@/components/ProfileSettings';

const Index = () => {
  const { user, isAuthenticated, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const renderContent = () => {
    if (!hasPermission('dashboard.view')) {
      return <div className="p-6 text-center text-red-600">Access Denied</div>;
    }

    switch (currentView) {
      case 'dashboard':
        return user?.role === 'manager' ? <Dashboard /> : <WelcomeDashboard />;
      case 'members':
        return <MemberManagement />;
      case 'checkin':
        return <CheckInSystem />;
      case 'payments':
        return <PaymentsBilling />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'staff':
        return <StaffManagement />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return user?.role === 'manager' ? <Dashboard /> : <WelcomeDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        onCollapseChange={setIsSidebarCollapsed}
      />
      <main className={`flex-1 overflow-x-hidden transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="container mx-auto p-4">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
