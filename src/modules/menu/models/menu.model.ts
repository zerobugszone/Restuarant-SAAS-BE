export interface MenuModel {
    id: string;
    name: string;
    description?: string;
    restaurantId: string;
    tableId?: string;
    isActive: boolean;
    displayOrder?: string;
    createdAt: Date;
    updatedAt: Date;
}
