import { useState } from 'react';
import { Search, Edit, UserPlus, Save, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'staff';
  lastLogin?: string;
  status: 'active' | 'inactive';
}

interface StaffFormProps {
  isEdit?: boolean;
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    status: 'active' | 'inactive';
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      status: 'active' | 'inactive';
    }>
  >;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const StaffForm = ({
  isEdit = false,
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  onSubmit,
  onCancel,
}: StaffFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter full name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="Enter email"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          {isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
        </label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Enter password"
            required={!isEdit}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Confirm Password</label>
        <Input
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          placeholder="Confirm password"
          required={!isEdit || formData.password !== ''}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
    <div className="flex gap-2 pt-4">
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
        <Save size={16} className="mr-2" />
        {isEdit ? 'Update Staff' : 'Add Staff'}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        <X size={16} className="mr-2" />
        Cancel
      </Button>
    </div>
  </form>
);

const StaffManagement = () => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Mock staff data - in real app this would come from API
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([
    {
      id: '2',
      name: 'Staff User',
      email: 'staff@fittrack.com',
      role: 'staff',
      lastLogin: '2024-01-15 10:30 AM',
      status: 'active',
    },
    {
      id: '3',
      name: 'John Staff',
      email: 'john.staff@fittrack.com',
      role: 'staff',
      lastLogin: '2024-01-14 02:15 PM',
      status: 'active',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Check if user has permission to manage staff
  if (!hasPermission('*')) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage staff users.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredStaff = staffUsers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStaff = (staff: StaffUser) => {
    setSelectedStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      password: '',
      confirmPassword: '',
      status: staff.status,
    });
    setShowPassword(false);
    setShowEditForm(true);
  };

  const handleAddStaff = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      status: 'active',
    });
    setShowPassword(false);
    setShowAddForm(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    const newStaff: StaffUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: 'staff',
      status: formData.status,
    };

    setStaffUsers((prev) => [...prev, newStaff]);
    setShowAddForm(false);
    toast({
      title: 'Success',
      description: 'Staff user added successfully',
    });
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (selectedStaff) {
      setStaffUsers((prev) =>
        prev.map((staff) =>
          staff.id === selectedStaff.id
            ? { ...staff, name: formData.name, email: formData.email, status: formData.status }
            : staff
        )
      );
      setShowEditForm(false);
      toast({
        title: 'Success',
        description: 'Staff user updated successfully',
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <Button onClick={handleAddStaff} className="bg-green-600 hover:bg-green-700">
          <UserPlus size={16} className="mr-2" />
          Add Staff
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search staff by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Users ({filteredStaff.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{staff.name}</h3>
                    <p className="text-sm text-gray-600">{staff.email}</p>
                    <p className="text-xs text-gray-400">Last login: {staff.lastLogin ?? 'N/A'}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={staff.status === 'active' ? 'success' : 'destructive'}
                      className="uppercase px-3 py-1 text-xs"
                    >
                      {staff.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditStaff(staff)}
                      aria-label="Edit staff"
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredStaff.length === 0 && <p className="text-center text-gray-500">No staff found.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Add Staff Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
          </DialogHeader>
          <StaffForm
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onSubmit={handleSubmitAdd}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
          </DialogHeader>
          <StaffForm
            isEdit
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onSubmit={handleSubmitEdit}
            onCancel={() => setShowEditForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;