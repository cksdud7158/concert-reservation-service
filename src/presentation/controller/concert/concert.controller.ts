import { Controller, Get, Inject, Param, UseGuards } from "@nestjs/common";
import { GetScheduleListResponse } from "@app/presentation/dto/concert/get-schedule-list/get-schedule-list.response";
import { IdPipe } from "@app/presentation/pipe/id.pipe";
import { GetSeatListResponse } from "@app/presentation/dto/concert/get-seat-list/get-seat-list.response";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiTag } from "@app/config/swagger/api-tag-enum";
import { GetSeatListUseCase } from "@app/application/use-case/concert/get-seat-list/get-seat-list.use-case";
import { GetScheduleListUseCase } from "@app/application/use-case/concert/get-schedule-list/get-schedule-list.use-case";
import { GetConcertListUseCase } from "@app/application/use-case/concert/get-concert-list/get-concert-list.use-case";
import { GetConcertListResponse } from "@app/presentation/dto/concert/get-concert-list/get-concert-list.response";
import { TokenGuard } from "@app/presentation/guard/token.guard";

@Controller("concerts")
@ApiTags(ApiTag.Concert)
export class ConcertController {
  constructor(
    @Inject() private readonly getScheduleListUseCase: GetScheduleListUseCase,
    @Inject() private readonly getSeatListUseCase: GetSeatListUseCase,
    @Inject() private readonly getConcertListUseCase: GetConcertListUseCase,
  ) {}

  @ApiOperation({ summary: "콘서트 목록 조회 API" })
  @Get("")
  @UseGuards(TokenGuard)
  async getConcertList(): Promise<GetConcertListResponse> {
    return GetConcertListResponse.toResponse(
      await this.getConcertListUseCase.execute(),
    );
  }

  @ApiOperation({ summary: "스케쥴 조회 API" })
  @Get(":concertId/schedules")
  @UseGuards(TokenGuard)
  async getScheduleList(
    @Param("concertId", IdPipe) concertId: number,
  ): Promise<GetScheduleListResponse> {
    return GetScheduleListResponse.toResponse(
      await this.getScheduleListUseCase.execute(concertId),
    );
  }

  @ApiOperation({ summary: "콘서트 좌석 정보 조회 API" })
  @Get("/schedules/:concertScheduleId/seats")
  @UseGuards(TokenGuard)
  async getSeatList(
    @Param("concertScheduleId", IdPipe) concertScheduleId: number,
  ): Promise<GetSeatListResponse> {
    return GetSeatListResponse.toResponse(
      await this.getSeatListUseCase.execute(concertScheduleId),
    );
  }
}
