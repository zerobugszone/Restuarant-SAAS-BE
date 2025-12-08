export interface RestaurantModel {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  timezone?: string;
  currency?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

