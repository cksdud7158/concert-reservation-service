import { WaitingQueueRepositorySymbol } from "@app/domain/interface/repository/waiting-queue.repository";
import { WaitingQueueRepositoryImpl } from "@app/infrastructure/repository/waiting-queue.repository.impl";

const WaitingQueueProvider = {
  provide: WaitingQueueRepositorySymbol,
  useClass: WaitingQueueRepositoryImpl,
};

export default WaitingQueueProvider;
