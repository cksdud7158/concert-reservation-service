import { TokenModule } from "@app/module/token/token.module";
import { ConcertModule } from "@app/module/concert/concert.module";
import { ReservationModule } from "@app/module/reservation/reservation.module";
import { UserModule } from "@app/module/user/user.module";
import { PaymentModule } from "@app/module/payment/payment.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WinstonModule } from "nest-winston";
import { winstoneConfig } from "@app/config/winstone/winstone.config";
import { ScheduleModule } from "@nestjs/schedule";
import { typeormTestConfig } from "./config/typeorm/typeorm-test.config";

export const mockAppModule = [
  TokenModule,
  ConcertModule,
  ReservationModule,
  UserModule,
  PaymentModule,
  TypeOrmModule.forRoot(typeormTestConfig),
  WinstonModule.forRoot(winstoneConfig),
  ScheduleModule.forRoot(),
];
