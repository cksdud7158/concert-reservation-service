import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import {
  UserRepository,
  UserRepositorySymbol,
} from "@app/domain/interface/repository/user.repository";

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepository,
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

    return point.point;
  }
}
