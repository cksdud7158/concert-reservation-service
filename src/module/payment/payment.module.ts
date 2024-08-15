import { Module } from "@nestjs/common";
import { PaymentController } from "@app/presentation/controller/payment/payment.controller";
import { PaymentService } from "@app/domain/service/payment/payment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "@app/infrastructure/entity/payment.entity";
import { ReservationModule } from "@app/module/reservation/reservation.module";
import { UserModule } from "@app/module/user/user.module";
import { ConcertModule } from "@app/module/concert/concert.module";
import { TokenModule } from "@app/module/token/token.module";
import paymentProvider from "@app/module/provider/repository/payment.provider";
import { PayUseCase } from "@app/application/use-case/payment/pay.use-case";
import { EventModule } from "@app/module/event/event.module";
import { PaidEventService } from "@app/domain/service/payment/paid-event.service";
import paidEventProvider from "@app/module/provider/repository/paid-event.provider";
import { PaidEvent } from "@app/infrastructure/entity/paid-event.entity";
import { UpdatePaidEventUseCase } from "@app/application/use-case/payment/update-paid-event.use-case";

@Module({
  controllers: [PaymentController],
  providers: [
    PayUseCase,
    UpdatePaidEventUseCase,
    PaymentService,
    PaidEventService,
    paidEventProvider,
    paymentProvider,
  ],
  imports: [
    TypeOrmModule.forFeature([Payment, PaidEvent]),
    ReservationModule,
    UserModule,
    ConcertModule,
    EventModule,
    TokenModule,
  ],
  exports: [PaidEventService, UpdatePaidEventUseCase],
})
export class PaymentModule {}
