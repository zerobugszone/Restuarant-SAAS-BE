export interface QrModel {
  id: string;
  tableId?: string;
  menuSectionId?: string;
  code: string;
  type: 'table' | 'menu';
  createdAt: Date;
  tenantId: string;
  qrImage?: string; // Data URL for QR code image
}
