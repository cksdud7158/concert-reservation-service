import { Module } from "@nestjs/common";
import { User } from "@app/infrastructure/entity/user.entity";
import { UserService } from "@app/domain/service/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "@app/presentation/controller/user/user.controller";
import { PointHistory } from "@app/infrastructure/entity/point-history.entity";
import { GetPointUseCase } from "@app/application/use-case/user/get-point/get-point.use-case";
import { ChargePointUseCase } from "@app/application/use-case/user/charge-point/charge-point.use-case";
import userProvider from "@app/module/provider/user.provider";
import pointHistoryProvider from "@app/module/provider/point-history.provider";

@Module({
  controllers: [UserController],
  providers: [
    GetPointUseCase,
    ChargePointUseCase,
    UserService,
    userProvider,
    pointHistoryProvider,
  ],
  imports: [TypeOrmModule.forFeature([User, PointHistory])],
  exports: [UserService, userProvider, pointHistoryProvider],
})
export class UserModule {}
