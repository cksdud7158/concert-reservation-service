import { Injectable } from "@nestjs/common";
import { UserRepository } from "@app/domain/interface/repository/user.repository";
import { User } from "@app/infrastructure/entity/User.entity";
import { InjectRepository } from "@nestjs/typeorm";
import PointEntity from "@app/domain/entity/point.entity";
import { EntityManager, Repository } from "typeorm";

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

  async findOnePointById(
    userId: number,
    _manager?: EntityManager,
  ): Promise<PointEntity> {
    const manager = _manager ?? this.waitingQueue.manager;
    const entity = await manager.findOne(User, {
      select: {
        point: true,
      },
      where: {
        id: userId,
      },
    });
    return new PointEntity(entity?.point);
  }
  async updatePoint(
    userId: number,
    point: number,
    _manager?: EntityManager,
  ): Promise<void> {
    const manager = _manager ?? this.waitingQueue.manager;
    await manager.update(
      User,
      {
        id: userId,
      },
      { point: point },
    );
  }
}
