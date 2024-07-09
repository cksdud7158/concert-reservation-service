import { Module } from "@nestjs/common";
import { ConcertController } from "@app/presentation/controller/concert/concert.controller";
import { GetScheduleListUseCase } from "@app/application/use-case/concert/get-schedule-list.use-case";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertScheduleRepositorySymbol } from "@app/domain/interface/repository/concert-schedule.repository";
import { ConcertScheduleRepositoryImpl } from "@app/infrastructure/repository/concert-schedule.repository.impl";

@Module({
  controllers: [ConcertController],
  providers: [
    GetScheduleListUseCase,
    ConcertService,
    {
      provide: ConcertScheduleRepositorySymbol,
      useClass: ConcertScheduleRepositoryImpl,
    },
  ],
  imports: [TypeOrmModule.forFeature([ConcertSchedule])],
})
export class ConcertModule {}
