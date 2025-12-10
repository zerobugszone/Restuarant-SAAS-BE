export interface TableModel {
    id: string;
    restaurantId: string;
    number: string;
    capacity: number;
    section?: string;
    qrCode?: string;
    isOccupied: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
