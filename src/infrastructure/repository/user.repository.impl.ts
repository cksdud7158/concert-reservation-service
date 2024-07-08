import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../../domain/interface/repository/user.repository";
import { User } from "../entity/User.entity";

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly waitingQueue: Repository<User>,
  ) {}

  async findOneById(userId: number, _manager?: EntityManager): Promise<User> {
    const manager = _manager ?? this.waitingQueue.manager;
    const entity = await manager.findOne(User, {
      where: {
        id: userId,
      },
    });

    return entity;
  }
}
