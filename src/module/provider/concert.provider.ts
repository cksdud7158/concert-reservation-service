import { ConcertRepositorySymbol } from "@app/domain/interface/repository/concert.repository";
import { ConcertRepositoryImpl } from "@app/infrastructure/repository/concert.repository.impl";

const concertProvider = {
  provide: ConcertRepositorySymbol,
  useClass: ConcertRepositoryImpl,
};

export default concertProvider;
