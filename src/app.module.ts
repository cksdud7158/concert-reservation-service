import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./config/module/auth/auth.module";
import { ConcertModule } from "./config/module/concert/concert.module";
import { ReservationModule } from "./config/module/reservation/reservation.module";

@Module({
  imports: [AuthModule, ConcertModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
