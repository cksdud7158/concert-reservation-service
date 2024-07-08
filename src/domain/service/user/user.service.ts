import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import {
  UserRepository,
  UserRepositorySymbol,
} from "../../interface/repository/user.repository";

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
}
