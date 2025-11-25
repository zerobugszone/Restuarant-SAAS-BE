import { v4 as uuid } from 'uuid';
import { QrModel } from '../models/qr.model';

const qrCodes = new Map<string, QrModel[]>();

const bucket = (tenantId: string) => {
  if (!qrCodes.has(tenantId)) {
    qrCodes.set(tenantId, []);
  }
  return qrCodes.get(tenantId)!;
};

export class QrRepository {
  async create(tenantId: string, payload: Omit<QrModel, 'id'>) {
    const qr: QrModel = { ...payload, id: uuid() };
    bucket(tenantId).push(qr);
    return qr;
  }

  async findById(tenantId: string, id: string) {
    return bucket(tenantId).find(qr => qr.id === id);
  }
}

export const qrRepository = new QrRepository();
