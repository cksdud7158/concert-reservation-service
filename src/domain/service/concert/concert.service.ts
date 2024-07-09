import { Inject, Injectable } from "@nestjs/common";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import {
  ConcertScheduleRepository,
  ConcertScheduleRepositorySymbol,
} from "@app/domain/interface/repository/concert-schedule.repository";

@Injectable()
export class ConcertService {
  constructor(
    @Inject(ConcertScheduleRepositorySymbol)
    private readonly concertScheduleRepository: ConcertScheduleRepository,
  ) {}

  async getScheduleList(
    concertId: number,
  ): Promise<Partial<ConcertSchedule>[]> {
    return this.concertScheduleRepository.findById(concertId);
  }
}
