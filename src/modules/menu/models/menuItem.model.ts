export interface MenuItemModel {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  isAvailable: boolean;
}
