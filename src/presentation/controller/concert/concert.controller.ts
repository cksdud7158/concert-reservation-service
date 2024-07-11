import { Controller, Get, Inject, Param } from "@nestjs/common";
import { GetScheduleListResponse } from "@app/presentation/dto/concert/get-schedule-list/get-schedule-list.response";
import { GetScheduleListUseCase } from "@app/application/use-case/concert/get-schedule-list.use-case";
import { IdPipe } from "@app/presentation/pipe/id.pipe";
import { GetSeatListUseCase } from "@app/application/use-case/concert/get-seat-list.use-case";
import { GetSeatListResponse } from "@app/presentation/dto/concert/get-seat-list/get-seat-list.response";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiTag } from "@app/config/swagger/api-tag-enum";

@Controller("concerts")
@ApiTags(ApiTag.Concert)
export class ConcertController {
  constructor(
    @Inject() private readonly getScheduleListUseCase: GetScheduleListUseCase,
    @Inject() private readonly getSeatListUseCase: GetSeatListUseCase,
  ) {}

  @ApiOperation({ summary: "스케쥴 조회 API" })
  @Get(":concertId/schedules")
  async getScheduleList(
    @Param("concertId", IdPipe) concertId: number,
  ): Promise<GetScheduleListResponse> {
    return GetScheduleListResponse.toResponse(
      await this.getScheduleListUseCase.execute(concertId),
    );
  }

  @ApiOperation({ summary: "콘서트 좌석 정보 조회 API" })
  @Get("/:concertId/schedules/:concertScheduleId/seats")
  async getSeatList(
    @Param("concertId", IdPipe) concertId: number,
    @Param("concertScheduleId", IdPipe) concertScheduleId: number,
  ): Promise<GetSeatListResponse> {
    return GetSeatListResponse.toResponse(
      await this.getSeatListUseCase.execute(concertId, concertScheduleId),
    );
  }
}
