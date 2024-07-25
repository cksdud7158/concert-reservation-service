import { UserRepository } from "@app/domain/interface/repository/user.repository";
import { User } from "@app/infrastructure/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import PointEntity from "@app/domain/entity/point.entity";
import { EntityManager, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "@app/domain/entity/user.entity";
import UserMapper from "@app/infrastructure/mapper/user.mapper";

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  async findOneById(
    userId: number,
    _manager?: EntityManager,
  ): Promise<UserEntity> {
    const manager = _manager ?? this.user.manager;
    const entity = await manager.findOne(User, {
      where: {
        id: userId,
      },
    });

    return UserMapper.toDomain(entity);
  }

  async findOnePointById(
    userId: number,
    _manager?: EntityManager,
  ): Promise<PointEntity> {
    const manager = _manager ?? this.user.manager;
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
    const manager = _manager ?? this.user.manager;
    await manager.update(
      User,
      {
        id: userId,
      },
      { point: point },
    );
  }
}
