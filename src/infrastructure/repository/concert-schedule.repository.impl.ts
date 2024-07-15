import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { ConcertScheduleRepository } from "@app/domain/interface/repository/concert-schedule.repository";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";

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
  ): Promise<ConcertSchedule[]> {
    const manager = _manager ?? this.concertSchedule.manager;
    const entity = await manager.find(ConcertSchedule, {
      where: {
        concert: {
          id: concertId,
        },
      },
    });

    return entity;
  }
}
