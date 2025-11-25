export interface MenuItemModel {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  isAvailable: boolean;
  tenantId: string;
}
