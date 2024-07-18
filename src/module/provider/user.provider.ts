import { UserRepositorySymbol } from "@app/domain/interface/repository/user.repository";
import { UserRepositoryImpl } from "@app/infrastructure/repository/user.repository.impl";

const userProvider = {
  provide: UserRepositorySymbol,
  useClass: UserRepositoryImpl,
};

export default userProvider;
