export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  create(payload: Partial<T>): Promise<T>;
}
