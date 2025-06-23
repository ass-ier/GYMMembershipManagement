
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Printer, QrCode, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import IDCard from './IDCard';
import { membersAPI } from '@/api/members';
import { plansAPI } from '@/api/plans';
import { paymentsAPI } from '@/api/payments';
import { useApi } from '@/hooks/useApi';
import type { MembershipPlan } from '@/api/types';

const MemberRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    plan: '1 Month',
    paymentMethod: 'cash',
    discount: 0
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);
  const [newMember, setNewMember] = useState<any>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  const { loading: memberLoading, execute: executeMemberAPI } = useApi();
  const { loading: planLoading, execute: executePlanAPI } = useApi();
  const { loading: paymentLoading, execute: executePaymentAPI } = useApi();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const plansData = await executePlanAPI(() => plansAPI.getPlans(), false);
      setPlans(plansData);
      if (plansData.length > 0) {
        setFormData(prev => ({ ...prev, plan: plansData[0].duration }));
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const selectedPlan = plans.find(p => p.duration === formData.plan);
  const discountAmount = selectedPlan ? (selectedPlan.price * formData.discount) / 100 : 0;
  const finalAmount = selectedPlan ? selectedPlan.price - discountAmount : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create member
      const member = await executeMemberAPI(() => membersAPI.createMember(formData));
      
      // Process payment
      await executePaymentAPI(() => paymentsAPI.processPayment(
        member.id,
        finalAmount,
        formData.paymentMethod,
        formData.plan
      ));

      setNewMember(member);
      setShowReceipt(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        plan: plans[0]?.duration || '1 Month',
        paymentMethod: 'cash',
        discount: 0
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const generateIDCard = () => {
    setShowReceipt(false);
    setShowIDCard(true);
  };

  const isLoading = memberLoading || planLoading || paymentLoading;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Member Registration</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+251-911-XXXXXX"
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
              <Input
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
              <Input
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleInputChange}
                placeholder="+251-911-XXXXXX"
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Membership & Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan">Membership Plan</Label>
                <select
                  id="plan"
                  name="plan"
                  value={formData.plan}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.duration}>
                      {plan.duration} - ETB {plan.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>

              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Plan Price:</span>
                <span>ETB {selectedPlan?.price.toLocaleString()}</span>
              </div>
              {formData.discount > 0 && (
                <div className="flex justify-between mb-2 text-red-600">
                  <span>Discount ({formData.discount}%):</span>
                  <span>-ETB {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Amount:</span>
                <span>ETB {finalAmount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <CreditCard className="h-4 w-4" />
            Register Member & Process Payment
          </Button>
        </div>
      </form>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
          </DialogHeader>
          {newMember && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold">FitTrack Pro</h2>
                <p className="text-sm text-gray-600">Receipt #{newMember.memberNumber}</p>
              </div>
              
              <div className="border-t border-b py-4 space-y-2">
                <div className="flex justify-between">
                  <span>Member:</span>
                  <span>{newMember.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span>{newMember.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{newMember.paymentMethod.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valid Until:</span>
                  <span>{newMember.expiryDate}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Amount Paid:</span>
                  <span>ETB {finalAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={printReceipt} variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button onClick={generateIDCard} className="flex-1">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate ID Card
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ID Card Dialog */}
      <Dialog open={showIDCard} onOpenChange={setShowIDCard}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Member ID Card</DialogTitle>
          </DialogHeader>
          {newMember && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <IDCard member={newMember} />
              </div>
              <Button onClick={() => window.print()} className="w-full">
                <Printer className="h-4 w-4 mr-2" />
                Print ID Card
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberRegistration;
