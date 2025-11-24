export interface SubscriptionModel {
  id: string;
  tenantId: string;
  planType: string;
  status: 'active' | 'canceled' | 'past_due';
  startDate: Date;
  endDate?: Date;
  amount?: number;
}
