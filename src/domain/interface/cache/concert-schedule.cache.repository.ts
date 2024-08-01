import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";

export const ConcertScheduleCacheRepositorySymbol = Symbol.for(
  "ConcertScheduleCacheRepository",
);

export interface ConcertScheduleCacheRepository {
  findById(concertId: number): Promise<ConcertScheduleEntity[]>;
  insert(
    concertId: number,
    concertScheduleEntities: ConcertScheduleEntity[],
  ): void;
}
