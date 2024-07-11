import { Module } from "@nestjs/common";
import { ConcertController } from "@app/presentation/controller/concert/concert.controller";
import { GetScheduleListUseCase } from "@app/application/use-case/concert/get-schedule-list.use-case";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertScheduleRepositorySymbol } from "@app/domain/interface/repository/concert-schedule.repository";
import { ConcertScheduleRepositoryImpl } from "@app/infrastructure/repository/concert-schedule.repository.impl";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { ConcertSeatRepositorySymbol } from "@app/domain/interface/repository/concert-seat.repository";
import { ConcertSeatRepositoryImpl } from "@app/infrastructure/repository/concert-seat.repository.impl";
import { ConcertRepositorySymbol } from "@app/domain/interface/repository/concert.repository";
import { ConcertRepositoryImpl } from "@app/infrastructure/repository/concert.repository.impl";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { GetSeatListUseCase } from "@app/application/use-case/concert/get-seat-list/get-seat-list.use-case";

@Module({
  controllers: [ConcertController],
  providers: [
    GetScheduleListUseCase,
    GetSeatListUseCase,
    ConcertService,
    {
      provide: ConcertScheduleRepositorySymbol,
      useClass: ConcertScheduleRepositoryImpl,
    },
    {
      provide: ConcertSeatRepositorySymbol,
      useClass: ConcertSeatRepositoryImpl,
    },
    {
      provide: ConcertRepositorySymbol,
      useClass: ConcertRepositoryImpl,
    },
  ],
  imports: [TypeOrmModule.forFeature([ConcertSchedule, ConcertSeat, Concert])],
  exports: [
    ConcertService,
    {
      provide: ConcertRepositorySymbol,
      useClass: ConcertRepositoryImpl,
    },
    {
      provide: ConcertSeatRepositorySymbol,
      useClass: ConcertSeatRepositoryImpl,
    },
  ],
})
export class ConcertModule {}
