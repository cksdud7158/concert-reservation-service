import { Inject, Injectable } from "@nestjs/common";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";

@Injectable()
export class GetScheduleListUseCase {
  constructor(@Inject() private readonly concertService: ConcertService) {}

  async execute(concertId: number): Promise<ConcertScheduleEntity[]> {
    return await this.concertService.getScheduleList(concertId);
  }
}
