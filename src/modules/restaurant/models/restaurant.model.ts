export interface RestaurantModel {
  tenantId: string;
  name: string;
  timezone?: string;
  currency?: string;
  address?: string;
  updatedAt: Date;
}
