import { ConcertScheduleRepositorySymbol } from "@app/domain/interface/repository/concert-schedule.repository";
import { ConcertScheduleRepositoryImpl } from "@app/infrastructure/repository/concert-schedule.repository.impl";

const concertScheduleProvider = {
  provide: ConcertScheduleRepositorySymbol,
  useClass: ConcertScheduleRepositoryImpl,
};

export default concertScheduleProvider;
