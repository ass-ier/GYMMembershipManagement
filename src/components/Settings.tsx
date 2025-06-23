
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, Edit, Plus, Trash } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  
  const [membershipPlans, setMembershipPlans] = useState([
    { id: 1, name: '1 Month', duration: 1, price: 3500, active: true },
    { id: 2, name: '3 Months', duration: 3, price: 7000, active: true },
    { id: 3, name: '6 Months', duration: 6, price: 15000, active: true },
    { id: 4, name: '1 Year', duration: 12, price: 32000, active: true }
  ]);

  const [gymSettings, setGymSettings] = useState({
    gymName: 'FitTrack Pro Gym',
    address: 'Addis Ababa, Ethiopia',
    phone: '+251-911-123456',
    email: 'info@fittrackpro.com',
    openTime: '05:00',
    closeTime: '22:00',
    enableSMSReminders: true,
    enableEmailReminders: true,
    reminderDaysBefore: 7
  });

  const [notificationTemplates, setNotificationTemplates] = useState({
    renewalReminder: 'Dear {name}, your membership expires on {date}. Please renew to continue enjoying our services.',
    paymentDue: 'Hi {name}, your payment of {amount} ETB is due on {date}. Please make the payment to avoid service interruption.',
    welcomeMessage: 'Welcome to FitTrack Pro Gym, {name}! Your membership is now active. Enjoy your fitness journey!'
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings Updated",
      description: "Your gym settings have been saved successfully.",
    });
  };

  const handlePlanUpdate = (id: number, field: string, value: any) => {
    setMembershipPlans(plans => 
      plans.map(plan => 
        plan.id === id ? { ...plan, [field]: value } : plan
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700">
          <Save size={16} className="mr-2" />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {membershipPlans.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <Label className="text-sm font-medium">{plan.name}</Label>
                      <p className="text-sm text-gray-600">{plan.duration} month(s)</p>
                    </div>
                    <Input
                      type="number"
                      value={plan.price}
                      onChange={(e) => handlePlanUpdate(plan.id, 'price', parseInt(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">ETB</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={plan.active}
                    onCheckedChange={(checked) => handlePlanUpdate(plan.id, 'active', checked)}
                  />
                  <Button variant="ghost" size="sm">
                    <Edit size={14} />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus size={16} className="mr-2" />
              Add New Plan
            </Button>
          </CardContent>
        </Card>

        {/* Gym Information */}
        <Card>
          <CardHeader>
            <CardTitle>Gym Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="gymName">Gym Name</Label>
              <Input
                id="gymName"
                value={gymSettings.gymName}
                onChange={(e) => setGymSettings({...gymSettings, gymName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={gymSettings.address}
                onChange={(e) => setGymSettings({...gymSettings, address: e.target.value})}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={gymSettings.phone}
                  onChange={(e) => setGymSettings({...gymSettings, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={gymSettings.email}
                  onChange={(e) => setGymSettings({...gymSettings, email: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openTime">Opening Time</Label>
                <Input
                  id="openTime"
                  type="time"
                  value={gymSettings.openTime}
                  onChange={(e) => setGymSettings({...gymSettings, openTime: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="closeTime">Closing Time</Label>
                <Input
                  id="closeTime"
                  type="time"
                  value={gymSettings.closeTime}
                  onChange={(e) => setGymSettings({...gymSettings, closeTime: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sms">SMS Reminders</Label>
              <Switch
                id="sms"
                checked={gymSettings.enableSMSReminders}
                onCheckedChange={(checked) => setGymSettings({...gymSettings, enableSMSReminders: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Email Reminders</Label>
              <Switch
                id="email"
                checked={gymSettings.enableEmailReminders}
                onCheckedChange={(checked) => setGymSettings({...gymSettings, enableEmailReminders: checked})}
              />
            </div>
            <div>
              <Label htmlFor="reminderDays">Reminder Days Before Expiry</Label>
              <Input
                id="reminderDays"
                type="number"
                value={gymSettings.reminderDaysBefore}
                onChange={(e) => setGymSettings({...gymSettings, reminderDaysBefore: parseInt(e.target.value)})}
                className="w-20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="renewal">Renewal Reminder</Label>
              <Textarea
                id="renewal"
                value={notificationTemplates.renewalReminder}
                onChange={(e) => setNotificationTemplates({...notificationTemplates, renewalReminder: e.target.value})}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="payment">Payment Due</Label>
              <Textarea
                id="payment"
                value={notificationTemplates.paymentDue}
                onChange={(e) => setNotificationTemplates({...notificationTemplates, paymentDue: e.target.value})}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="welcome">Welcome Message</Label>
              <Textarea
                id="welcome"
                value={notificationTemplates.welcomeMessage}
                onChange={(e) => setNotificationTemplates({...notificationTemplates, welcomeMessage: e.target.value})}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
