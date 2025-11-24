export class PaymentGatewayService {
  async charge(amount: number, method: string) {
    // Simulate gateway call
    return { status: 'succeeded', reference: `${method}-${Date.now()}` };
  }
}

export const paymentGatewayService = new PaymentGatewayService();
