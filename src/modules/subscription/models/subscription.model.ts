export interface SubscriptionModel {
  id: string;
  planType: string;
  status: 'active' | 'canceled' | 'past_due';
  startDate: Date;
  endDate?: Date;
  amount?: number;
  tenantId: string;
}
