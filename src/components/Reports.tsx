
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');

  const membershipData = [
    { month: 'Jan', newMembers: 45, renewals: 23, expired: 12 },
    { month: 'Feb', newMembers: 52, renewals: 28, expired: 15 },
    { month: 'Mar', newMembers: 48, renewals: 31, expired: 18 },
    { month: 'Apr', newMembers: 61, renewals: 35, expired: 14 },
    { month: 'May', newMembers: 55, renewals: 42, expired: 20 },
    { month: 'Jun', newMembers: 67, renewals: 38, expired: 16 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 185000, target: 200000 },
    { month: 'Feb', revenue: 220000, target: 210000 },
    { month: 'Mar', revenue: 245000, target: 230000 },
    { month: 'Apr', revenue: 285000, target: 250000 },
    { month: 'May', revenue: 265000, target: 260000 },
    { month: 'Jun', revenue: 315000, target: 300000 }
  ];

  const planDistribution = [
    { name: '1 Month', value: 120, color: '#8884d8' },
    { name: '3 Months', value: 85, color: '#82ca9d' },
    { name: '6 Months', value: 35, color: '#ffc658' },
    { name: '1 Year', value: 7, color: '#ff7c7c' }
  ];

  const attendanceData = [
    { day: 'Mon', checkins: 89 },
    { day: 'Tue', checkins: 76 },
    { day: 'Wed', checkins: 95 },
    { day: 'Thu', checkins: 82 },
    { day: 'Fri', checkins: 101 },
    { day: 'Sat', checkins: 118 },
    { day: 'Sun', checkins: 73 }
  ];

  const handleExportReport = () => {
    // Export functionality would be implemented here
    console.log('Exporting report...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 3 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">ETB 1,515,000</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Members</p>
                <p className="text-2xl font-bold text-gray-900">67</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +8.2% from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Daily Check-ins</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingDown size={12} className="mr-1" />
                  -3.1% from last week
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Calendar size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Member Retention</p>
                <p className="text-2xl font-bold text-gray-900">87.3%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +2.1% from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <TrendingUp size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`ETB ${value.toLocaleString()}`, '']} />
                <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                <Bar dataKey="target" fill="#e5e7eb" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Membership Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={membershipData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="newMembers" stroke="#3b82f6" name="New Members" />
                <Line type="monotone" dataKey="renewals" stroke="#22c55e" name="Renewals" />
                <Line type="monotone" dataKey="expired" stroke="#ef4444" name="Expired" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Check-ins (This Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="checkins" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
