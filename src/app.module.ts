import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PaymentModule } from "./module/payment/payment.module";
import { ConcertModule } from "./module/concert/concert.module";
import { TokenModule } from "./module/token/token.module";
import { UserModule } from "./module/user/user.module";
import { ReservationModule } from "./module/reservation/reservation.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./config/typeorm/typeorm.config";

@Module({
  imports: [
    TokenModule,
    ConcertModule,
    ReservationModule,
    UserModule,
    PaymentModule,
    TypeOrmModule.forRoot(typeORMConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
