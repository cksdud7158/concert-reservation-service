import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import {
  UserRepository,
  UserRepositorySymbol,
} from "@app/domain/interface/repository/user.repository";
import {
  PointHistoryRepository,
  PointHistoryRepositorySymbol,
} from "@app/domain/interface/repository/point-history.repository";
import PointHistoryType from "@app/infrastructure/enum/point-history.enum";
import { EntityManager } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepository,
    @Inject(PointHistoryRepositorySymbol)
    private readonly pointHistoryRepository: PointHistoryRepository,
  ) {}

  async hasUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new BadRequestException("없는 유저입니다.");
    }
  }

  async getPoint(userId: number): Promise<number> {
    const point = await this.userRepository.findOnePointById(userId);
    return point.point;
  }

  async chargePoint(userId: number, amount: number): Promise<number> {
    // 포인트 조회
    const point = await this.userRepository.findOnePointById(userId);

    // 잔액 충전
    point.add(amount);
    await this.userRepository.updatePoint(userId, point.point);

    // history 추가
    await this.pointHistoryRepository.insert(
      userId,
      PointHistoryType.CHARGE,
      amount,
      point.point,
    );

    return point.point;
  }

  async usePoint(
    userId: number,
    amount: number,
    _manager?: EntityManager,
  ): Promise<number> {
    // 포인트 조회
    const point = await this.userRepository.findOnePointById(userId, _manager);

    // 포인트 사용
    point.use(amount);
    await this.userRepository.updatePoint(userId, point.point, _manager);

    // history 추가
    await this.pointHistoryRepository.insert(
      userId,
      PointHistoryType.USE,
      amount,
      point.point,
      _manager,
    );

    return point.point;
  }
}
