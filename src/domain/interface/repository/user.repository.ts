import { EntityManager } from "typeorm";
import { User } from "../../../infrastructure/entity/User.entity";

export const UserRepositorySymbol = Symbol.for("UserRepository");

export interface UserRepository {
  findOneById(userId: number, _manager?: EntityManager): Promise<User | null>;
  findOnePointById(
    userId: number,
    _manager?: EntityManager,
  ): Promise<number | null>;
}
