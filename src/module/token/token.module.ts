import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TokenController } from "../../presentation/controller/token/token.controller";
import key from "../../config/token/key";
import { GetTokenUseCase } from "../../application/use-case/token/get-token.use-case";
import { TokenService } from "../../domain/service/token/token.service";
import { WaitingQueueRepositorySymbol } from "../../domain/interface/repository/waiting-queue.repository";
import { WaitingQueueRepositoryImpl } from "../../infrastructure/repository/waiting-queue.repository.impl";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WaitingQueue } from "../../infrastructure/entity/waiting-queue.entity";
import { UserModule } from "../user/user.module";

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
