import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { WaitingQueueRepositorySymbol } from "@app/domain/interface/repository/waiting-queue.repository";
import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WaitingQueueRepositoryImpl } from "@app/infrastructure/repository/waiting-queue.repository.impl";
import { UserModule } from "@app/module/user/user.module";
import { TokenController } from "@app/presentation/controller/token/token.controller";
import key from "@app/config/token/key";
import { TokenService } from "@app/domain/service/token/token.service";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token/get-token.use-case";

@Module({
  controllers: [TokenController],
  providers: [
    GetTokenUseCase,
    TokenService,
    {
      provide: WaitingQueueRepositorySymbol,
      useClass: WaitingQueueRepositoryImpl,
    },
  ],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: key,
      signOptions: { expiresIn: "1h" },
    }),
    TypeOrmModule.forFeature([WaitingQueue]),
  ],
})
export class TokenModule {}
