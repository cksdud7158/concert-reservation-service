import { Inject, Injectable } from "@nestjs/common";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";

@Injectable()
export class GetSeatListUseCase {
  constructor(@Inject() private readonly concertService: ConcertService) {}

  async execute(
    concertId: number,
    concertScheduleId: number,
  ): Promise<Partial<ConcertSeat>[]> {
    return await this.concertService.getSeatList(concertId, concertScheduleId);
  }
}
