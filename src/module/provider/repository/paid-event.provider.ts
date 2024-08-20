import { PaidEventRepositorySymbol } from "@app/domain/interface/repository/paid-event.repository";
import { PaidEventRepositoryImpl } from "@app/infrastructure/repository/paid-event.repository.impl";

const paidEventProvider = {
  provide: PaidEventRepositorySymbol,
  useClass: PaidEventRepositoryImpl,
};

export default paidEventProvider;
