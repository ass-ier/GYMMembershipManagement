import { useState } from 'react';
import { Search, Filter, UserPlus, Edit, Trash2, ChevronDown, ChevronRight, CreditCard, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import IDCard from './IDCard';
import ImportMembers from './ImportMembers';

const MemberManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    members: true,
    addForm: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const members = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@email.com', 
      phone: '+251-911-123456', 
      plan: '3 Months', 
      status: 'active', 
      joinDate: '2024-01-15', 
      expiryDate: '2024-04-15',
      memberNumber: 'FT001234'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@email.com', 
      phone: '+251-911-789012', 
      plan: '1 Year', 
      status: 'active', 
      joinDate: '2024-02-01', 
      expiryDate: '2025-02-01',
      memberNumber: 'FT001235'
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike@email.com', 
      phone: '+251-911-345678', 
      plan: '1 Month', 
      status: 'expired', 
      joinDate: '2024-01-01', 
      expiryDate: '2024-02-01',
      memberNumber: 'FT001236'
    },
  ];

  const membershipPlans = [
    { duration: '1 Month', price: 3500 },
    { duration: '3 Months', price: 7000 },
    { duration: '6 Months', price: 15000 },
    { duration: '1 Year', price: 32000 },
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const viewIDCard = (member: any) => {
    setSelectedMember(member);
    setShowIDCard(true);
  };

  const SectionHeader = ({ title, sectionKey, action }: { title: string; sectionKey: keyof typeof expandedSections; action?: React.ReactNode }) => (
    <Collapsible open={expandedSections[sectionKey]} onOpenChange={() => toggleSection(sectionKey)}>
      <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          {expandedSections[sectionKey] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {sectionKey === 'search' && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Search members by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {sectionKey === 'members' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Members List ({filteredMembers.length})</CardTitle>
                <Button 
                  onClick={() => setShowImportDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload size={16} className="mr-2" />
                  Import Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-gray-600">{member.email}</p>
                        <p className="text-gray-600">{member.phone}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>Plan: {member.plan}</span>
                          <span>Member #: {member.memberNumber}</span>
                          <span>Joined: {member.joinDate}</span>
                          <span>Expires: {member.expiryDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.status === 'active' ? 'default' : 'destructive'}>
                          {member.status}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewIDCard(member)}
                        >
                          <CreditCard size={16} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit size={16} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {sectionKey === 'addForm' && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Member</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input placeholder="Enter full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="Enter email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input placeholder="+251-911-XXXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Membership Plan</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {membershipPlans.map((plan) => (
                        <option key={plan.duration} value={plan.duration}>
                          {plan.duration} - ETB {plan.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Discount (%)</label>
                    <Input type="number" placeholder="0" min="0" max="100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Add Member
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      setExpandedSections(prev => ({ ...prev, addForm: false }));
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Member Management</h1>
      
      <SectionHeader title="Search & Filter" sectionKey="search" />
      <SectionHeader title="Members List" sectionKey="members" />
      <SectionHeader 
        title="Add New Member" 
        sectionKey="addForm"
        action={
          <Button 
            onClick={() => {
              setShowAddForm(true);
              setExpandedSections(prev => ({ ...prev, addForm: true }));
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <UserPlus size={16} className="mr-2" />
            Add Member
          </Button>
        }
      />

      {/* ID Card Dialog */}
      <Dialog open={showIDCard} onOpenChange={setShowIDCard}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Member ID Card - {selectedMember?.name}</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <IDCard member={selectedMember} />
              </div>
              <Button onClick={() => window.print()} className="w-full">
                Print ID Card
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Import Members Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Members from Excel</DialogTitle>
          </DialogHeader>
          <ImportMembers />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberManagement;
