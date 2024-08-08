import { EntityManager } from "typeorm";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";
import { ConcertEntity } from "@app/domain/entity/concert.entity";

export const ConcertScheduleRepositorySymbol = Symbol.for(
  "ConcertScheduleRepository",
);

export interface ConcertScheduleRepository {
  findById(
    concertId: number,
    _manager?: EntityManager,
  ): Promise<ConcertScheduleEntity[]>;

  save(data: ConcertScheduleEntity[]): Promise<void>;
}
