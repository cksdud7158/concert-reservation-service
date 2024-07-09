import { Module } from "@nestjs/common";
import { UserRepositorySymbol } from "@app/domain/interface/repository/user.repository";
import { User } from "@app/infrastructure/entity/User.entity";
import { UserService } from "@app/domain/service/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChargePointUseCase } from "@app/application/use-case/User/charge-point.use-case";
import { GetPointUseCase } from "@app/application/use-case/User/get-point.use-case";
import { UserController } from "@app/presentation/controller/user/user.controller";
import { UserRepositoryImpl } from "@app/infrastructure/repository/user.repository.impl";

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
  ],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [
    UserService,
    {
      provide: UserRepositorySymbol,
      useClass: UserRepositoryImpl,
    },
  ],
})
export class UserModule {}
