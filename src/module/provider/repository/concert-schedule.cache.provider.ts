import { ConcertScheduleCacheRepositorySymbol } from "@app/domain/interface/cache/concert-schedule.cache.repository";
import { ConcertScheduleCacheRepositoryImpl } from "@app/infrastructure/redis/concert-schedule.cache.repository.impl";

const concertScheduleCacheProvider = {
  provide: ConcertScheduleCacheRepositorySymbol,
  useClass: ConcertScheduleCacheRepositoryImpl,
};

export default concertScheduleCacheProvider;
