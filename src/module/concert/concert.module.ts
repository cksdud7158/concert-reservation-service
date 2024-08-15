import { Module } from "@nestjs/common";
import { ConcertController } from "@app/presentation/controller/concert/concert.controller";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { TokenModule } from "@app/module/token/token.module";
import concertScheduleProvider from "@app/module/provider/repository/concert-schedule.provider";
import concertSeatProvider from "@app/module/provider/repository/concert-seat.provider";
import concertProvider from "@app/module/provider/repository/concert.provider";
import { GetConcertListUseCase } from "@app/application/use-case/concert/get-concert-list.use-case";
import { GetScheduleListUseCase } from "@app/application/use-case/concert/get-schedule-list.use-case";
import { GetSeatListUseCase } from "@app/application/use-case/concert/get-seat-list.use-case";
import concertScheduleCacheProvider from "@app/module/provider/repository/concert-schedule.cache.provider";

@Module({
  controllers: [ConcertController],
  providers: [
    GetScheduleListUseCase,
    GetSeatListUseCase,
    GetConcertListUseCase,
    ConcertService,
    concertProvider,
    concertScheduleProvider,
    concertScheduleCacheProvider,
    concertSeatProvider,
  ],
  imports: [
    TypeOrmModule.forFeature([ConcertSchedule, ConcertSeat, Concert]),
    TokenModule,
  ],
  exports: [ConcertService, concertProvider, concertSeatProvider],
})
export class ConcertModule {}
