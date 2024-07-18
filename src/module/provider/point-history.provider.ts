import { PointHistoryRepositorySymbol } from "@app/domain/interface/repository/point-history.repository";
import { PointHistoryRepositoryImpl } from "@app/infrastructure/repository/point-history.repository.impl";

const pointHistoryProvider = {
  provide: PointHistoryRepositorySymbol,
  useClass: PointHistoryRepositoryImpl,
};

export default pointHistoryProvider;
