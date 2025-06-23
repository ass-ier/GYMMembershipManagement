
import { useState } from 'react';
import { Users, DollarSign, Calendar, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Dashboard = () => {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    recent: true,
    alerts: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionHeader = ({ title, sectionKey }: { title: string; sectionKey: keyof typeof expandedSections }) => (
    <Collapsible open={expandedSections[sectionKey]} onOpenChange={() => toggleSection(sectionKey)}>
      <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {expandedSections[sectionKey] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        {sectionKey === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ETB 245,300</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">Peak: 2-4 PM</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">12</div>
                <p className="text-xs text-muted-foreground">Due today</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {sectionKey === 'recent' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "John Doe", time: "10:30 AM", status: "active" },
                    { name: "Jane Smith", time: "10:15 AM", status: "active" },
                    { name: "Mike Johnson", time: "9:45 AM", status: "expired" },
                    { name: "Sarah Wilson", time: "9:30 AM", status: "active" },
                  ].map((member, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{member.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{member.time}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Alex Brown", plan: "3 Months", date: "Today" },
                    { name: "Lisa Davis", plan: "1 Month", date: "Yesterday" },
                    { name: "Tom Wilson", plan: "1 Year", date: "2 days ago" },
                    { name: "Emma Jones", plan: "6 Months", date: "3 days ago" },
                  ].map((member, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{member.name}</span>
                        <p className="text-sm text-gray-500">{member.plan}</p>
                      </div>
                      <span className="text-sm text-gray-500">{member.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {sectionKey === 'alerts' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Important Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                  <p className="text-sm font-medium text-red-800">12 members have overdue payments</p>
                  <p className="text-xs text-red-600">Total amount: ETB 42,000</p>
                </div>
                <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <p className="text-sm font-medium text-orange-800">5 memberships expiring this week</p>
                  <p className="text-xs text-orange-600">Contact them for renewal</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-sm font-medium text-blue-800">New member registrations are up 15%</p>
                  <p className="text-xs text-blue-600">Great month so far!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <SectionHeader title="Overview Statistics" sectionKey="overview" />
      <SectionHeader title="Recent Activity" sectionKey="recent" />
      <SectionHeader title="Alerts & Notifications" sectionKey="alerts" />
    </div>
  );
};

export default Dashboard;
