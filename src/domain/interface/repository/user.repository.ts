import { EntityManager } from "typeorm";
import PointEntity from "@app/domain/entity/user/point.entity";
import { UserEntity } from "@app/domain/entity/user/user.entity";

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
