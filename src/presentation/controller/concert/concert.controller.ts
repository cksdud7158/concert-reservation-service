import { Controller, Get, Inject, Param } from "@nestjs/common";
import { GetScheduleListResponse } from "@app/presentation/dto/concert/get-schedule-list/get-schedule-list.response";
import { GetScheduleListUseCase } from "@app/application/use-case/concert/get-schedule-list.use-case";
import { IdPipe } from "@app/presentation/pipe/id.pipe";

@Controller("concerts")
export class ConcertController {
  constructor(
    @Inject() private readonly getScheduleListUseCase: GetScheduleListUseCase,
  ) {}

  @Get(":concertId/schedules")
  async getScheduleList(
    @Param("concertId", IdPipe) concertId: number,
  ): Promise<GetScheduleListResponse> {
    return GetScheduleListResponse.toResponse(
      await this.getScheduleListUseCase.execute(concertId),
    );
  }

  @Get("/concerts/:concertId/schedules/:concertDateId/seats")
  async getSeatList(
    @Param("concertId") concertId: number,
    @Param("concertDateId") concertDateId: number,
  ): Promise<any> {
    return {
      seats: [
        {
          seatId: 1,
          seatNum: 1,
          isReserved: false,
        },
      ],
    };
  }
}
