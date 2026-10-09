import api from './api';
import type { InitiatePaymentPayload, PaymentResponse, Payment } from '@/types/payment.types';
import type { ApiResponse } from '@/types/api.types';

export const paymentService = {
  initiatePayment: async (payload: InitiatePaymentPayload): Promise<PaymentResponse> => {
    const { data } = await api.post<ApiResponse<PaymentResponse>>('/api/payments/initiate', payload);
    return data.data;
  },

  verifyPayment: async (reference: string): Promise<Payment> => {
    const { data } = await api.get<ApiResponse<Payment>>(`/api/payments/verify/${reference}`);
    return data.data;
  },

  getPaymentByBooking: async (bookingId: string): Promise<Payment> => {
    const { data } = await api.get<ApiResponse<Payment>>(`/api/payments/booking/${bookingId}`);
    return data.data;
  },
};
