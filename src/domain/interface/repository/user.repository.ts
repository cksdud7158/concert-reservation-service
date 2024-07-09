import { EntityManager } from "typeorm";
import { User } from "src/infrastructure/entity/User.entity";
import PointEntity from "src/domain/entity/point.entity";

export const UserRepositorySymbol = Symbol.for("UserRepository");

export interface UserRepository {
  findOneById(userId: number, _manager?: EntityManager): Promise<User | null>;
  findOnePointById(
    userId: number,
    _manager?: EntityManager,
  ): Promise<PointEntity>;

  updatePoint(
    userId: number,
    point: number,
    _manager?: EntityManager,
  ): Promise<void>;
}
