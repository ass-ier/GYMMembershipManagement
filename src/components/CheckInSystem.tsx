
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, Search, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckIn {
  id: string;
  memberName: string;
  memberId: string;
  time: string;
  date: string;
  status: 'Valid' | 'Expired' | 'Unpaid';
}

const CheckInSystem = () => {
  const { toast } = useToast();
  const [memberInput, setMemberInput] = useState('');
  const [todayCheckIns, setTodayCheckIns] = useState<CheckIn[]>([
    {
      id: '1',
      memberName: 'Abel Tesfaye',
      memberId: '001',
      time: '06:30 AM',
      date: new Date().toISOString().split('T')[0],
      status: 'Valid'
    },
    {
      id: '2',
      memberName: 'Hanan Mohammed',
      memberId: '002',
      time: '07:15 AM',
      date: new Date().toISOString().split('T')[0],
      status: 'Valid'
    },
    {
      id: '3',
      memberName: 'Sara Kebede',
      memberId: '004',
      time: '08:00 AM',
      date: new Date().toISOString().split('T')[0],
      status: 'Valid'
    }
  ]);

  // Mock member data for lookup
  const members = [
    { id: '001', name: 'Abel Tesfaye', status: 'Active', expires: '2024-07-01' },
    { id: '002', name: 'Hanan Mohammed', status: 'Active', expires: '2024-08-01' },
    { id: '003', name: 'Dawit Alemu', status: 'Expired', expires: '2024-06-01' },
    { id: '004', name: 'Sara Kebede', status: 'Active', expires: '2024-12-01' },
  ];

  const handleCheckIn = () => {
    if (!memberInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter member ID or name",
        variant: "destructive"
      });
      return;
    }

    // Find member by ID or name
    const member = members.find(m => 
      m.id === memberInput || 
      m.name.toLowerCase().includes(memberInput.toLowerCase())
    );

    if (!member) {
      toast({
        title: "Member Not Found",
        description: "No member found with that ID or name",
        variant: "destructive"
      });
      return;
    }

    // Check if member already checked in today
    const alreadyCheckedIn = todayCheckIns.some(checkIn => 
      checkIn.memberId === member.id
    );

    if (alreadyCheckedIn) {
      toast({
        title: "Already Checked In",
        description: `${member.name} has already checked in today`,
        variant: "destructive"
      });
      return;
    }

    // Check membership status
    let status: 'Valid' | 'Expired' | 'Unpaid' = 'Valid';
    if (member.status === 'Expired') {
      status = 'Expired';
    }

    const newCheckIn: CheckIn = {
      id: Date.now().toString(),
      memberName: member.name,
      memberId: member.id,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      date: new Date().toISOString().split('T')[0],
      status
    };

    setTodayCheckIns([newCheckIn, ...todayCheckIns]);
    setMemberInput('');

    if (status === 'Valid') {
      toast({
        title: "Check-In Successful",
        description: `${member.name} checked in successfully`,
      });
    } else {
      toast({
        title: "Check-In Warning",
        description: `${member.name} checked in but membership is ${status.toLowerCase()}`,
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheckIn();
    }
  };

  const stats = {
    total: todayCheckIns.length,
    valid: todayCheckIns.filter(c => c.status === 'Valid').length,
    issues: todayCheckIns.filter(c => c.status !== 'Valid').length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Check-In System</h1>
        <div className="text-sm text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Check-In Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Check-ins</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <Calendar size={24} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valid Members</p>
                <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <User size={24} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Issues</p>
                <p className="text-2xl font-bold text-red-600">{stats.issues}</p>
              </div>
              <div className="p-3 rounded-full bg-red-500">
                <Clock size={24} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Check-In Form */}
      <Card>
        <CardHeader>
          <CardTitle>Member Check-In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Enter Member ID or Name..."
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 text-lg h-12"
                />
              </div>
            </div>
            <Button 
              onClick={handleCheckIn}
              className="bg-green-600 hover:bg-green-700 h-12 px-8"
            >
              Check In
            </Button>
            <Button 
              variant="outline"
              className="h-12 px-4"
            >
              <QrCode size={20} />
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            Tip: You can search by member ID (e.g., "001") or name (e.g., "Abel")
          </div>
        </CardContent>
      </Card>

      {/* Today's Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Check-ins ({todayCheckIns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayCheckIns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No check-ins yet today
              </div>
            ) : (
              todayCheckIns.map((checkIn) => (
                <div key={checkIn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {checkIn.memberName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{checkIn.memberName}</p>
                      <p className="text-sm text-gray-600">ID: {checkIn.memberId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{checkIn.time}</p>
                      <p className="text-sm text-gray-600">{checkIn.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      checkIn.status === 'Valid' ? 'bg-green-100 text-green-800' :
                      checkIn.status === 'Expired' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {checkIn.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInSystem;
