import { EntityManager } from "typeorm";
import PointEntity from "src/domain/entity/point.entity";
import { UserEntity } from "@app/domain/entity/user.entity";

export const UserRepositorySymbol = Symbol.for("UserRepository");

export interface UserRepository {
  findOneById(
    userId: number,
    _manager?: EntityManager,
  ): Promise<UserEntity | null>;

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
