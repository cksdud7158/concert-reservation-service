import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "@app/module/user/user.module";
import { TokenController } from "@app/presentation/controller/token/token.controller";
import key from "@app/config/token/key";
import { TokenService } from "@app/domain/service/token/token.service";
import { GetWaitingStatusUseCase } from "@app/application/use-case/token/get-waiting-status.use-case";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token.use-case";
import { CheckWaitingQueuesUseCase } from "@app/application/use-case/token/check-waiting-queues.use-case";
import { RedisModule } from "@app/module/redis/redis.module";

@Module({
  controllers: [TokenController],
  providers: [
    GetTokenUseCase,
    GetWaitingStatusUseCase,
    CheckWaitingQueuesUseCase,
    TokenService,
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
  exports: [TokenService],
})
export class TokenModule {}
