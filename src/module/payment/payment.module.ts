import { Module } from "@nestjs/common";
import { PaymentController } from "@app/presentation/controller/payment/payment.controller";
import { PayUseCase } from "@app/application/use-case/payment/pay.use-case";
import { PaymentService } from "@app/domain/service/payment/payment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "@app/infrastructure/entity/payment.entity";
import { PaymentRepositorySymbol } from "@app/domain/interface/repository/payment.repository";
import { PaymentRepositoryImpl } from "@app/infrastructure/repository/payment.repository.impl";
import { ReservationModule } from "@app/module/reservation/reservation.module";
import { UserModule } from "@app/module/user/user.module";
import { ConcertModule } from "@app/module/concert/concert.module";

@Module({
  controllers: [PaymentController],
  providers: [
    PayUseCase,
    PaymentService,
    {
      provide: PaymentRepositorySymbol,
      useClass: PaymentRepositoryImpl,
    },
  ],

  imports: [
    TypeOrmModule.forFeature([Payment]),
    ReservationModule,
    UserModule,
    ConcertModule,
  ],
})
export class PaymentModule {}
