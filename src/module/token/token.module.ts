import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "@app/module/user/user.module";
import { TokenController } from "@app/presentation/controller/token/token.controller";
import key from "@app/config/token/key";
import { TokenService } from "@app/domain/service/token/token.service";
import waitingQueueProvider from "@app/module/provider/waiting-queue.provider";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token/get-token.use-case";
import { GetWaitingStatusUseCase } from "@app/application/use-case/token/get-waiting-status/get-waiting-status.use-case";

@Module({
  controllers: [TokenController],
  providers: [
    GetTokenUseCase,
    GetWaitingStatusUseCase,
    TokenService,
    waitingQueueProvider,
  ],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: key,
      signOptions: { expiresIn: "2h" },
    }),
    TypeOrmModule.forFeature([WaitingQueue]),
  ],
  exports: [TokenService],
})
export class TokenModule {}
