import { UserRepository } from "@app/domain/interface/repository/user.repository";
import { User } from "@app/infrastructure/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import PointEntity from "@app/domain/entity/user/point.entity";
import { EntityManager, Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "@app/domain/entity/user/user.entity";
import UserMapper from "@app/infrastructure/mapper/user.mapper";
import PointMapper from "@app/infrastructure/mapper/point.mapper";

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
    const entity = await manager
      .createQueryBuilder()
      .select("id")
      .from(User, "user")
      .where("id = :id", { id: userId })
      .execute();

    if (!entity.length) {
      throw new BadRequestException("조회된 유저가 없습니다.");
    }
    return UserMapper.toDomain(entity[0]);
  }

  async findOnePointById(
    userId: number,
    _manager?: EntityManager,
  ): Promise<PointEntity> {
    const manager = _manager ?? this.user.manager;
    const entity = await manager
      .createQueryBuilder()
      .select("point")
      .from(User, "user")
      .where("id = :id", { id: userId })
      .execute();

    if (!entity.length) {
      throw new BadRequestException("조회된 유저가 없습니다.");
    }

    return PointMapper.toDomain(entity[0].point);
  }

  async updatePoint(
    userId: number,
    point: number,
    _manager?: EntityManager,
  ): Promise<void> {
    const manager = _manager ?? this.user.manager;
    await manager
      .createQueryBuilder()
      .update(User)
      .set({ point: point })
      .where("id = :id", { id: userId })
      .execute();
  }
}
