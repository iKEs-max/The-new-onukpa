export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type PaymentProvider = 'hubtel' | 'stripe' | 'paystack';

export interface Payment {
  id: string;
  bookingId: string;
  amount: string;
  currency: string;
  provider: PaymentProvider;
  reference: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InitiatePaymentPayload {
  bookingId: string;
  provider: PaymentProvider;
  callbackUrl?: string;
}

export interface PaymentResponse {
  paymentUrl: string;
  reference: string;
}
