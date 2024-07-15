import { Inject, Injectable } from "@nestjs/common";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";

@Injectable()
export class GetScheduleListUseCase {
  constructor(@Inject() private readonly concertService: ConcertService) {}

  async execute(concertId: number): Promise<Partial<ConcertSchedule>[]> {
    return await this.concertService.getScheduleList(concertId);
  }
}
