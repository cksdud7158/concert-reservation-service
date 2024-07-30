import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "@app/module/user/user.module";
import { TokenController } from "@app/presentation/controller/token/token.controller";
import key from "@app/config/token/key";
import { TokenService } from "@app/domain/service/token/token.service";
import waitingQueueProvider from "@app/module/provider/waiting-queue.provider";
import { GetWaitingStatusUseCase } from "@app/application/use-case/token/get-waiting-status.use-case";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token.use-case";
import { TokenScheduler } from "@app/presentation/schedule/token/token.scheduler";
import { CheckWaitingQueuesUseCase } from "@app/application/use-case/token/check-waiting-queues.use-case";
import { RedisModule } from "@app/module/redis/redis.module";

@Module({
  controllers: [TokenController],
  providers: [
    GetTokenUseCase,
    GetWaitingStatusUseCase,
    CheckWaitingQueuesUseCase,
    TokenService,
    waitingQueueProvider,
  ],
  imports: [
    UserModule,
    RedisModule,
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
