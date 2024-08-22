export const CacheRepositorySymbol = Symbol.for("CacheRepository");

export interface CacheRepository {
  get(key: string): Promise<any>;

  set(key: string, value: string): void;
}
