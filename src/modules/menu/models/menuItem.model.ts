export interface MenuItemModel {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  preparationTime?: number; // in minutes
  calories?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spicyLevel?: number; // 0-5 scale
  isAvailable: boolean;
  isActive: boolean;
  displayOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

