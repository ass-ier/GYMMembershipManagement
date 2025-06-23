
import { mockApiCall } from './config';
import { ApiResponse, PaymentRecord } from './types';

// Mock payments data - replace with real API calls
const mockPayments: PaymentRecord[] = [
  {
    id: '1',
    memberId: '1',
    amount: 7000,
    method: 'cash',
    date: '2024-01-15',
    plan: '3 Months',
    status: 'completed'
  },
  {
    id: '2',
    memberId: '2',
    amount: 32000,
    method: 'bank_transfer',
    date: '2024-02-01',
    plan: '1 Year',
    status: 'completed'
  }
];

export const paymentsAPI = {
  processPayment: async (memberId: string, amount: number, method: string, plan: string): Promise<ApiResponse<PaymentRecord>> => {
    // TODO: Replace with actual API call
    const newPayment: PaymentRecord = {
      id: Date.now().toString(),
      memberId,
      amount,
      method,
      plan,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    
    mockPayments.push(newPayment);
    
    return mockApiCall({
      success: true,
      data: newPayment,
      message: 'Payment processed successfully'
    });
  },

  getPayments: async (memberId?: string): Promise<ApiResponse<PaymentRecord[]>> => {
    // TODO: Replace with actual API call
    let filteredPayments = mockPayments;
    
    if (memberId) {
      filteredPayments = mockPayments.filter(p => p.memberId === memberId);
    }
    
    return mockApiCall({
      success: true,
      data: filteredPayments
    });
  }
};
