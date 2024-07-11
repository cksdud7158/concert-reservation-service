import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PaymentModule } from "./module/payment/payment.module";
import { ConcertModule } from "./module/concert/concert.module";
import { AuthModule } from "./module/auth/auth.module";
import { UserModule } from "./module/user/user.module";
import { ReservationModule } from "./module/reservation/reservation.module";

@Module({
  imports: [
    AuthModule,
    ConcertModule,
    ReservationModule,
    UserModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
