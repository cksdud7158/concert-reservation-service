import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PointHistoryRepository } from "@app/domain/interface/repository/point-history.repository";
import { PointHistory } from "@app/infrastructure/entity/point-history.entity";
import PointHistoryType from "@app/domain/enum/entity/point-history.enum";

@Injectable()
export class PointHistoryRepositoryImpl implements PointHistoryRepository {
  constructor(
    @InjectRepository(PointHistory)
    private readonly pointHistory: Repository<PointHistory>,
  ) {}

  async insert(
    userId: number,
    type: PointHistoryType,
    amount: number,
    balance: number,
    _manager?: EntityManager,
  ): Promise<void> {
    const pointHistory = {
      user: {
        id: userId,
      },
      balance: balance,
      amount: amount,
      type: type,
    };

    const manager = _manager ?? this.pointHistory.manager;
    await manager
      .createQueryBuilder()
      .insert()
      .into(PointHistory)
      .values(pointHistory)
      .execute();
  }
}
