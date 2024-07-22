import { Module } from "@nestjs/common";
import { PaymentController } from "@app/presentation/controller/payment/payment.controller";
import { PaymentService } from "@app/domain/service/payment/payment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "@app/infrastructure/entity/payment.entity";
import { ReservationModule } from "@app/module/reservation/reservation.module";
import { UserModule } from "@app/module/user/user.module";
import { ConcertModule } from "@app/module/concert/concert.module";
import { TokenModule } from "@app/module/token/token.module";
import paymentProvider from "@app/module/provider/payment.provider";
import { PayUseCase } from "@app/application/use-case/payment/pay.use-case";

@Module({
  controllers: [PaymentController],
  providers: [PayUseCase, PaymentService, paymentProvider],

  imports: [
    TypeOrmModule.forFeature([Payment]),
    ReservationModule,
    UserModule,
    ConcertModule,
    TokenModule,
  ],
})
export class PaymentModule {}
