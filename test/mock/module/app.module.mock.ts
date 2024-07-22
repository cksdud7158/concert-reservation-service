import { Module } from "@nestjs/common";
import { typeormConfigMock } from "../config/typeorm.config.mock";
import { AppController } from "@app/app.controller";
import { PaymentModule } from "@app/module/payment/payment.module";
import { TokenModule } from "@app/module/token/token.module";
import { ConcertModule } from "@app/module/concert/concert.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "@app/module/user/user.module";
import { ReservationModule } from "@app/module/reservation/reservation.module";

@Module({
  imports: [
    TokenModule,
    ConcertModule,
    ReservationModule,
    UserModule,
    PaymentModule,
    TypeOrmModule.forRoot(typeormConfigMock),
  ],
  controllers: [AppController],
  providers: [AppModuleMock],
})
export class AppModuleMock {}
