import { Body, Controller, Inject, Post, UseGuards } from "@nestjs/common";
import { ReserveConcertRequest } from "@app/presentation/dto/reservation/reserve-concert/reserve-concert.request";
import { ReserveConcertResponse } from "@app/presentation/dto/reservation/reserve-concert/reserve-concert.response";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiTag } from "@app/config/swagger/api-tag-enum";
import { ReserveConcertUseCase } from "@app/application/use-case/reservation/reserve-concert/reserve-concert.use-case";
import { TokenGuard } from "@app/presentation/guard/token.guard";

@Controller("reservation")
@ApiTags(ApiTag.Reservation)
export class ReservationController {
  constructor(
    @Inject() private readonly reserveConcertUseCase: ReserveConcertUseCase,
  ) {}

  @ApiOperation({ summary: "콘서트 좌석 예매 API" })
  @ApiCreatedResponse({
    description: "콘서트 좌석 예매 완료",
    type: ReserveConcertResponse,
  })
  @Post("")
  @UseGuards(TokenGuard)
  async reserveConcert(
    @Body() reserveConcertRequest: ReserveConcertRequest,
  ): Promise<ReserveConcertResponse> {
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
