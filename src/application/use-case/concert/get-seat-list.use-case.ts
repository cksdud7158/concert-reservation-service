import { Inject, Injectable } from "@nestjs/common";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { ConcertSeatEntity } from "@app/domain/entity/concert-seat.entity";

@Injectable()
export class GetSeatListUseCase {
  constructor(@Inject() private readonly concertService: ConcertService) {}

  async execute(concertScheduleId: number): Promise<ConcertSeatEntity[]> {
    return await this.concertService.getSeatList(concertScheduleId);
  }
}
