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
import { ExpireTokenUseCase } from "@app/application/use-case/token/expire-token.use-case";
import { TokenScheduler } from "@app/presentation/schedule/token/token.scheduler";
import { CacheService } from "@app/domain/service/cache/cache.service";
import cacheProvider from "@app/module/provider/repository/cache.provider";

@Module({
  controllers: [TokenController],
  providers: [
    GetTokenUseCase,
    RefreshTokenUseCase,
    ChangeToActiveQueuesUseCase,
    ExpireTokenUseCase,
    TokenService,
    TokenScheduler,
    CacheService,
    WaitingQueueProvider,
    cacheProvider,
  ],
  imports: [
    UserModule,
    RedisModule,
    JwtModule.register({
      global: true,
      secret: key,
      signOptions: { expiresIn: "2h" },
    }),
  ],
  exports: [TokenService, ExpireTokenUseCase],
})
export class TokenModule {}
