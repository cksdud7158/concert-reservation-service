import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "@app/module/user/user.module";
import { TokenController } from "@app/presentation/controller/token/token.controller";
import key from "@app/config/token/key";
import { TokenService } from "@app/domain/service/token/token.service";
import { RefreshTokenUseCase } from "@app/application/use-case/token/refresh-token.use-case";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token.use-case";
import { ChangeToActiveQueuesUseCase } from "@app/application/use-case/token/change-to-active-queues.use-case";
import { RedisModule } from "@app/module/redis/redis.module";
import WaitingQueueProvider from "@app/module/provider/repository/waiting-queue.provider";
import { EventModule } from "@app/module/event/event.module";

@Module({
  controllers: [TokenController],
  providers: [
    GetTokenUseCase,
    RefreshTokenUseCase,
    ChangeToActiveQueuesUseCase,
    TokenService,
    WaitingQueueProvider,
  ],
  imports: [
    UserModule,
    RedisModule,
    EventModule,
    JwtModule.register({
      global: true,
      secret: key,
      signOptions: { expiresIn: "2h" },
    }),
  ],
  exports: [TokenService],
})
export class TokenModule {}
