import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./config/module/auth/auth.module";
import { ConcertModule } from "./config/module/concert/concert.module";

@Module({
  imports: [AuthModule, ConcertModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
