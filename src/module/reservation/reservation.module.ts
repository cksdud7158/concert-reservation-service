import { Module } from "@nestjs/common";
import { ReservationController } from "@app/presentation/controller/reservation/reservation.controller";
import { ReserveConcertUseCase } from "@app/application/use-case/reservation/reserve-concert.use-case";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import { TicketRepositorySymbol } from "@app/domain/interface/repository/ticket.repository";
import { TicketRepositoryImpl } from "@app/infrastructure/repository/ticket.repository.impl";
import { ConcertModule } from "@app/module/concert/concert.module";

@Module({
  controllers: [ReservationController],
  providers: [
    ReserveConcertUseCase,
    ReservationService,
    {
      provide: TicketRepositorySymbol,
      useClass: TicketRepositoryImpl,
    },
  ],
  imports: [TypeOrmModule.forFeature([Ticket]), ConcertModule],
  exports: [
    ReservationService,
    {
      provide: TicketRepositorySymbol,
      useClass: TicketRepositoryImpl,
    },
  ],
})
export class ReservationModule {}
