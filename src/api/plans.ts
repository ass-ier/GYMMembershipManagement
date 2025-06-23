
import { mockApiCall } from './config';
import { ApiResponse, MembershipPlan } from './types';

// Mock plans data - replace with real API calls
const mockPlans: MembershipPlan[] = [
  { id: '1', duration: '1 Month', price: 3500, freezeDays: 3 },
  { id: '2', duration: '3 Months', price: 7000, freezeDays: 10 },
  { id: '3', duration: '6 Months', price: 15000, freezeDays: 25 },
  { id: '4', duration: '1 Year', price: 32000, freezeDays: 30 },
];

export const plansAPI = {
  getPlans: async (): Promise<ApiResponse<MembershipPlan[]>> => {
    // TODO: Replace with actual API call
    return mockApiCall({
      success: true,
      data: mockPlans
    });
  },

  getPlan: async (id: string): Promise<ApiResponse<MembershipPlan | null>> => {
    // TODO: Replace with actual API call
    const plan = mockPlans.find(p => p.id === id);
    return mockApiCall({
      success: !!plan,
      data: plan || null
    });
  },

  createPlan: async (planData: Omit<MembershipPlan, 'id'>): Promise<ApiResponse<MembershipPlan>> => {
    // TODO: Replace with actual API call
    const newPlan: MembershipPlan = {
      id: Date.now().toString(),
      ...planData
    };
    
    mockPlans.push(newPlan);
    
    return mockApiCall({
      success: true,
      data: newPlan,
      message: 'Plan created successfully'
    });
  },

  updatePlan: async (id: string, planData: Partial<MembershipPlan>): Promise<ApiResponse<MembershipPlan>> => {
    // TODO: Replace with actual API call
    const planIndex = mockPlans.findIndex(p => p.id === id);
    if (planIndex !== -1) {
      mockPlans[planIndex] = { ...mockPlans[planIndex], ...planData };
      return mockApiCall({
        success: true,
        data: mockPlans[planIndex],
        message: 'Plan updated successfully'
      });
    }
    
    return mockApiCall({
      success: false,
      data: null as any,
      error: 'Plan not found'
    });
  },

  extendMemberPlan: async (memberId: string, planId: string, paymentMethod: string): Promise<ApiResponse<boolean>> => {
    // TODO: Replace with actual API call
    return mockApiCall({
      success: true,
      data: true,
      message: 'Member plan extended successfully'
    });
  },

  freezeMemberPlan: async (memberId: string, days: number): Promise<ApiResponse<boolean>> => {
    // TODO: Replace with actual API call
    return mockApiCall({
      success: true,
      data: true,
      message: `Member plan frozen for ${days} days`
    });
  }
};
