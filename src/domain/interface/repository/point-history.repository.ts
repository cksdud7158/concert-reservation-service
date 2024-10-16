import { EntityManager } from "typeorm";
import PointHistoryType from "@app/domain/enum/entity/point-history.enum";

export const PointHistoryRepositorySymbol = Symbol.for(
  "PointHistoryRepository",
);

export interface PointHistoryRepository {
  insert(
    userId: number,
    type: PointHistoryType,
    amount: number,
    balance: number,
    _manager?: EntityManager,
  ): Promise<void>;
}
