import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ReserveConcertRequest } from "@app/presentation/dto/reservation/reserve-concert/reserve-concert.request";
import { ReserveConcertUseCase } from "@app/application/use-case/reservation/reserve-concert.use-case";
import { ReserveConcertResponse } from "@app/presentation/dto/reservation/reserve-concert/reserve-concert.response";

@Controller("reservation")
export class ReservationController {
  constructor(
    @Inject() private readonly reserveConcertUseCase: ReserveConcertUseCase,
  ) {}
  @Post("")
  async reserveConcert(
    @Body() reserveConcertRequest: ReserveConcertRequest,
  ): Promise<any> {
    return ReserveConcertResponse.toResponse(
      await this.reserveConcertUseCase.execute(
        reserveConcertRequest.userId,
        reserveConcertRequest.concertId,
        reserveConcertRequest.concertScheduleId,
        reserveConcertRequest.seatIds,
      ),
    );
  }
}
