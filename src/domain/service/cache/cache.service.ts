import { Inject, Injectable } from "@nestjs/common";
import {
  CacheRepository,
  CacheRepositorySymbol,
} from "@app/domain/interface/cache/cache.repository";

@Injectable()
export class CacheService {
  constructor(
    @Inject(CacheRepositorySymbol)
    private readonly cacheRepository: CacheRepository,
  ) {}

  getCache(key: string) {
    return this.cacheRepository.get(key);
  }

  setCache(key: string, value: any) {
    return this.cacheRepository.set(key, JSON.stringify(value));
  }
}
