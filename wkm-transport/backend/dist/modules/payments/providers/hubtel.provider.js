"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeHubtelProvider = void 0;
class FakeHubtelProvider {
    async initializePayment(amount, currency, reference, customerData) {
        console.log(`[Hubtel] Initializing mock payment for ${amount} ${currency}`);
        return {
            success: true,
            authorizationUrl: `https://checkout.hubtel.com/mock/${reference}`,
            reference,
        };
    }
    async verifyPayment(reference) {
        console.log(`[Hubtel] Verifying mock payment ${reference}`);
        return {
            success: true,
            status: 'SUCCESS',
            amount: 100, // mock
            currency: 'GHS'
        };
    }
}
exports.FakeHubtelProvider = FakeHubtelProvider;
