
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, Pause, RefreshCw, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const MemberPlansManagement = () => {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [showFreezeDialog, setShowFreezeDialog] = useState(false);
  const [extendData, setExtendData] = useState({ plan: '1 Month', paymentMethod: 'cash' });

  const members = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@email.com', 
      plan: '3 Months', 
      status: 'active', 
      expiryDate: '2024-04-15',
      freezeDaysUsed: 0,
      maxFreezeDays: 10
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@email.com', 
      plan: '1 Year', 
      status: 'active', 
      expiryDate: '2025-02-01',
      freezeDaysUsed: 5,
      maxFreezeDays: 30
    },
  ];

  const membershipPlans = [
    { duration: '1 Month', price: 3500, freezeDays: 3 },
    { duration: '3 Months', price: 7000, freezeDays: 10 },
    { duration: '6 Months', price: 15000, freezeDays: 25 },
    { duration: '1 Year', price: 32000, freezeDays: 30 },
  ];

  const handleExtendPlan = () => {
    toast({
      title: "Plan Extended",
      description: `${selectedMember.name}'s plan has been extended successfully`
    });
    setShowExtendDialog(false);
  };

  const handleFreezePlan = (days: number) => {
    if (selectedMember.freezeDaysUsed + days > selectedMember.maxFreezeDays) {
      toast({
        title: "Error",
        description: "Exceeds maximum freeze days allowed",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Plan Frozen",
      description: `${selectedMember.name}'s plan has been frozen for ${days} days`
    });
    setShowFreezeDialog(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Member Plans Management</h1>
      
      <div className="grid gap-4">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-gray-600">{member.email}</p>
                  <div className="flex gap-2">
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                    <Badge variant="outline">{member.plan}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">Expires: {member.expiryDate}</p>
                  <p className="text-sm text-gray-500">
                    Freeze days used: {member.freezeDaysUsed}/{member.maxFreezeDays}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMember(member);
                      setShowExtendDialog(true);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Extend/Change
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMember(member);
                      setShowFreezeDialog(true);
                    }}
                    disabled={member.freezeDaysUsed >= member.maxFreezeDays}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Freeze
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Extend/Change Plan Dialog */}
      <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend/Change Plan - {selectedMember?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPlan">New Plan</Label>
              <select
                id="newPlan"
                value={extendData.plan}
                onChange={(e) => setExtendData({...extendData, plan: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {membershipPlans.map((plan) => (
                  <option key={plan.duration} value={plan.duration}>
                    {plan.duration} - ETB {plan.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <select
                id="paymentMethod"
                value={extendData.paymentMethod}
                onChange={(e) => setExtendData({...extendData, paymentMethod: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>

            <Button onClick={handleExtendPlan} className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Process Payment & Update Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Freeze Plan Dialog */}
      <Dialog open={showFreezeDialog} onOpenChange={setShowFreezeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Freeze Plan - {selectedMember?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Available freeze days: {selectedMember?.maxFreezeDays - selectedMember?.freezeDaysUsed}
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              {[3, 7, 14, 30].map((days) => (
                <Button
                  key={days}
                  variant="outline"
                  onClick={() => handleFreezePlan(days)}
                  disabled={selectedMember && (selectedMember.freezeDaysUsed + days > selectedMember.maxFreezeDays)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {days} Days
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Custom days"
                min="1"
                max={selectedMember?.maxFreezeDays - selectedMember?.freezeDaysUsed}
              />
              <Button variant="outline">Apply</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberPlansManagement;
