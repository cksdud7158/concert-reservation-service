import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { ConcertScheduleRepository } from "@app/domain/interface/repository/concert-schedule.repository";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";
import ConcertScheduleMapper from "@app/infrastructure/mapper/concert-schedule.mapper";

@Injectable()
export class ConcertScheduleRepositoryImpl
  implements ConcertScheduleRepository
{
  constructor(
    @InjectRepository(ConcertSchedule)
    private readonly concertSchedule: Repository<ConcertSchedule>,
  ) {}

  async findById(
    concertId: number,
    _manager?: EntityManager,
  ): Promise<ConcertScheduleEntity[]> {
    const manager = _manager ?? this.concertSchedule.manager;
    const entities = await manager
      .createQueryBuilder()
      .select()
      .from(ConcertSchedule, "schedule")
      .where("schedule.concert_id = :concertId", { concertId: concertId })
      .execute();

    return entities.map((schedule) => ConcertScheduleMapper.toDomain(schedule));
  }

  async save(data: ConcertScheduleEntity[]): Promise<void> {
    await this.concertSchedule.save(data);
  }
}
