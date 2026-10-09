import { useState } from 'react';
import { paymentService } from '@/services/payment.service';
import type { InitiatePaymentPayload, Payment, PaymentResponse } from '@/types/payment.types';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);

  const initiatePayment = async (payload: InitiatePaymentPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await paymentService.initiatePayment(payload);
      setPaymentData(response);
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      }
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment initiation failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string): Promise<Payment> => {
    setIsLoading(true);
    setError(null);
    try {
      const payment = await paymentService.verifyPayment(reference);
      return payment;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment verification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { initiatePayment, verifyPayment, isLoading, error, paymentData, clearError: () => setError(null) };
};
