import { Module } from "@nestjs/common";
import { ReservationController } from "@app/presentation/controller/reservation/reservation.controller";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import { TicketRepositorySymbol } from "@app/domain/interface/repository/ticket.repository";
import { TicketRepositoryImpl } from "@app/infrastructure/repository/ticket.repository.impl";
import { ConcertModule } from "@app/module/concert/concert.module";
import { TokenModule } from "@app/module/token/token.module";
import ticketProvider from "@app/module/provider/ticket.provider";
import { ReserveConcertUseCase } from "@app/application/use-case/reservation/reserve-concert.use-case";
import { RedisModule } from "@app/module/redis/redis.module";

@Module({
  controllers: [ReservationController],
  providers: [ReserveConcertUseCase, ReservationService, ticketProvider],
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    ConcertModule,
    TokenModule,
    RedisModule,
  ],
  exports: [
    ReservationService,
    {
      provide: TicketRepositorySymbol,
      useClass: TicketRepositoryImpl,
    },
  ],
})
export class ReservationModule {}
