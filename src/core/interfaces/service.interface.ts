export interface Service<T = unknown> {
  findAll(...args: unknown[]): Promise<T[]>;
}
