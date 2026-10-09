export interface PaymentProvider {
  initializePayment(amount: number, currency: string, reference: string, customerData: any): Promise<PaymentInitResult>;
  verifyPayment(reference: string): Promise<PaymentVerificationResult>;
}

export interface PaymentInitResult {
  success: boolean;
  authorizationUrl?: string;
  reference: string;
  providerData?: any;
  error?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount: number;
  currency: string;
  providerData?: any;
}
