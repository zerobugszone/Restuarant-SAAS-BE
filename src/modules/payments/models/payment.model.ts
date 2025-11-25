export type PaymentStatus = 'pending' | 'succeeded' | 'failed';

export interface PaymentModel {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  reference?: string;
  createdAt: Date;
  tenantId: string;
}
