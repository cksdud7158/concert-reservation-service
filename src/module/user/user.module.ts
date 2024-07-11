import { Module } from "@nestjs/common";
import { UserRepositorySymbol } from "@app/domain/interface/repository/user.repository";
import { User } from "@app/infrastructure/entity/user.entity";
import { UserService } from "@app/domain/service/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChargePointUseCase } from "@app/application/use-case/User/charge-point.use-case";
import { UserController } from "@app/presentation/controller/user/user.controller";
import { UserRepositoryImpl } from "@app/infrastructure/repository/user.repository.impl";
import { PointHistoryRepositorySymbol } from "@app/domain/interface/repository/point-history.repository";
import { PointHistoryRepositoryImpl } from "@app/infrastructure/repository/point-history.repository.impl";
import { PointHistory } from "@app/infrastructure/entity/point-history.entity";
import { GetPointUseCase } from "@app/application/use-case/User/get-point/get-point.use-case";

@Module({
  controllers: [UserController],
  providers: [
    GetPointUseCase,
    ChargePointUseCase,
    UserService,
    {
      provide: UserRepositorySymbol,
      useClass: UserRepositoryImpl,
    },
    {
      provide: PointHistoryRepositorySymbol,
      useClass: PointHistoryRepositoryImpl,
    },
  ],
  imports: [TypeOrmModule.forFeature([User, PointHistory])],
  exports: [
    UserService,
    {
      provide: UserRepositorySymbol,
      useClass: UserRepositoryImpl,
    },
    {
      provide: PointHistoryRepositorySymbol,
      useClass: PointHistoryRepositoryImpl,
    },
  ],
})
export class UserModule {}
