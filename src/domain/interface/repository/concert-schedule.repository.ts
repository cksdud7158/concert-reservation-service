import { EntityManager } from "typeorm";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";

export const ConcertScheduleRepositorySymbol = Symbol.for(
  "ConcertScheduleRepository",
);

export interface ConcertScheduleRepository {
  findById(
    concertId: number,
    _manager?: EntityManager,
  ): Promise<Partial<ConcertSchedule>[]>;
}
