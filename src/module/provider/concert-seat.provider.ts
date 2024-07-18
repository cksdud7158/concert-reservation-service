import { ConcertSeatRepositorySymbol } from "@app/domain/interface/repository/concert-seat.repository";
import { ConcertSeatRepositoryImpl } from "@app/infrastructure/repository/concert-seat.repository.impl";

const concertSeatProvider = {
  provide: ConcertSeatRepositorySymbol,
  useClass: ConcertSeatRepositoryImpl,
};

export default concertSeatProvider;
