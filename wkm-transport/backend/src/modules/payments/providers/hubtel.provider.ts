import { PaymentInitResult, PaymentProvider, PaymentVerificationResult } from '../payment.types';

export class FakeHubtelProvider implements PaymentProvider {
  async initializePayment(amount: number, currency: string, reference: string, customerData: any): Promise<PaymentInitResult> {
    console.log(`[Hubtel] Initializing mock payment for ${amount} ${currency}`);
    return {
      success: true,
      authorizationUrl: `https://checkout.hubtel.com/mock/${reference}`,
      reference,
    };
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResult> {
    console.log(`[Hubtel] Verifying mock payment ${reference}`);
    return {
      success: true,
      status: 'SUCCESS',
      amount: 100, // mock
      currency: 'GHS'
    };
  }
}
