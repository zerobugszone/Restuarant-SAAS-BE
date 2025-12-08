export interface CategoryModel {
  id: string;
  menuId: string;
  name: string;
  description?: string;
  displayOrder?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

