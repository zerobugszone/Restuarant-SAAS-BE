import { QrRepository, qrRepository } from '../repositories/qr.repository';
import { v4 as uuid } from 'uuid';
import QRCode from 'qrcode';

export class QrService {
  constructor(private readonly repository: QrRepository = qrRepository) {}

  async generateForTable(tenantId: string, tableId: string) {
    const code = `table-${tableId}-${uuid()}`;
    const qrImage = await QRCode.toDataURL(code);
    return this.repository.create(tenantId, {
      tenantId,
      tableId,
      code,
      type: 'table',
      createdAt: new Date(),
      qrImage,
    });
  }

  async generateForMenu(tenantId: string, menuSectionId: string) {
    const code = `menu-${menuSectionId}-${uuid()}`;
    const qrImage = await QRCode.toDataURL(code);
    return this.repository.create(tenantId, {
      tenantId,
      menuSectionId,
      code,
      type: 'menu',
      createdAt: new Date(),
      qrImage,
    });
  }

  getById(tenantId: string, id: string) {
    return this.repository.findById(tenantId, id);
  }

  updateQr(
    tenantId: string,
    id: string,
    payload: Partial<{
      tableId?: string;
      menuSectionId?: string;
      code?: string;
      type?: 'table' | 'menu';
    }>
  ) {
    return this.repository.update(tenantId, id, payload);
  }
}
