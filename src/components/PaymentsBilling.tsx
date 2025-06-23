
import { useState } from 'react';
import { CreditCard, DollarSign, AlertCircle, Search, Filter, Download, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const PaymentsBilling = () => {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    pending: true,
    recent: true
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
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">ETB 42,000</div>
                <p className="text-xs text-muted-foreground">12 members overdue</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collected Today</CardTitle>
                <CreditCard className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">ETB 18,500</div>
                <p className="text-xs text-muted-foreground">15 payments received</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Monthly Payment</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ETB 993</div>
                <p className="text-xs text-muted-foreground">Per member</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {sectionKey === 'pending' && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Pending Payments
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search members..." className="pl-10" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: "John Doe", amount: "ETB 3,500", plan: "3 Months", daysOverdue: 5, phone: "+251-911-123456" },
                    { name: "Jane Smith", amount: "ETB 1,200", plan: "1 Month", daysOverdue: 12, phone: "+251-911-234567" },
                    { name: "Mike Johnson", amount: "ETB 7,200", plan: "6 Months", daysOverdue: 3, phone: "+251-911-345678" },
                    { name: "Sarah Wilson", amount: "ETB 2,400", plan: "2 Months", daysOverdue: 8, phone: "+251-911-456789" },
                  ].map((payment, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{payment.name}</h3>
                          <p className="text-sm text-gray-600">{payment.plan} Plan</p>
                          <p className="text-xs text-gray-500">{payment.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">{payment.amount}</p>
                          <p className="text-xs text-red-500">{payment.daysOverdue} days overdue</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">Contact</Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">Mark Paid</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {sectionKey === 'recent' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Alex Brown", amount: "ETB 3,600", plan: "3 Months", date: "Today 10:30 AM", method: "Cash" },
                  { name: "Lisa Davis", amount: "ETB 1,200", plan: "1 Month", date: "Today 9:15 AM", method: "Bank Transfer" },
                  { name: "Tom Wilson", amount: "ETB 12,000", plan: "1 Year", date: "Yesterday 4:20 PM", method: "Cash" },
                  { name: "Emma Jones", amount: "ETB 7,200", plan: "6 Months", date: "Yesterday 2:10 PM", method: "Mobile Money" },
                ].map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <span className="font-medium">{payment.name}</span>
                      <p className="text-sm text-gray-600">{payment.plan} Plan</p>
                      <p className="text-xs text-gray-500">{payment.method}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-600">{payment.amount}</span>
                      <p className="text-xs text-gray-500">{payment.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Payments & Billing</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <CreditCard className="h-4 w-4 mr-2" />
          Record Payment
        </Button>
      </div>
      
      <SectionHeader title="Payment Overview" sectionKey="overview" />
      <SectionHeader title="Pending Payments" sectionKey="pending" />
      <SectionHeader title="Recent Payments" sectionKey="recent" />
    </div>
  );
};

export default PaymentsBilling;
