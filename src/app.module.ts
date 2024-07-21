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
import { WinstonModule } from "nest-winston";
import { winstoneConfig } from "@app/config/winstone/winstone.config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "@app/presentation/interceptor/logging/logging.interceptor";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    TokenModule,
    ConcertModule,
    ReservationModule,
    UserModule,
    PaymentModule,
    TypeOrmModule.forRoot(typeORMConfig),
    WinstonModule.forRoot(winstoneConfig),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [],
})
export class AppModule {}
