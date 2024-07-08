import { Module } from "@nestjs/common";
import { UserController } from "../../presentation/controller/user/user.controller";
import { UserService } from "../../domain/service/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../infrastructure/entity/User.entity";
import { UserRepositorySymbol } from "../../domain/interface/repository/user.repository";
import { UserRepositoryImpl } from "../../infrastructure/repository/user.repository.impl";
import { GetPointUseCase } from "../../application/use-case/User/get-point.use-case";

@Module({
  controllers: [UserController],
  providers: [
    GetPointUseCase,
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
