
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { User, Clock, Calendar, Activity } from 'lucide-react';

const WelcomeDashboard = () => {
  const { user } = useAuth();
  
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'manager':
        return 'You have full access to all system features and settings.';
      case 'staff':
        return 'You can handle member check-ins, payments, and member management.';
      default:
        return 'Welcome to FitTrack Pro.';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
          <User className="h-10 w-10 text-blue-600" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getCurrentGreeting()}, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">Welcome back to FitTrack Pro</p>
        </div>

        <Badge className={`${getRoleColor(user?.role || '')} px-3 py-1 text-sm font-medium`}>
          {user?.role.toUpperCase()} ACCESS
        </Badge>

        <p className="text-gray-600 max-w-md mx-auto">
          {getRoleDescription(user?.role || '')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.role}</div>
            <p className="text-xs text-muted-foreground">
              Access Level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user?.role === 'manager' && (
                <>
                  <div className="text-center p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                    <User className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium">Manage Users</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                    <Activity className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">View Reports</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm font-medium">Schedules</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm font-medium">Analytics</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
