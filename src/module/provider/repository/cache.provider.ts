import { CacheRepositorySymbol } from "@app/domain/interface/cache/cache.repository";
import { CacheRepositoryImpl } from "@app/infrastructure/redis/cache.repository.impl";

const cacheProvider = {
  provide: CacheRepositorySymbol,
  useClass: CacheRepositoryImpl,
};

export default cacheProvider;
