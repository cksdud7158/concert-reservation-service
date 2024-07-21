import { Inject, Injectable } from "@nestjs/common";
import { UserService } from "@app/domain/service/user/user.service";

@Injectable()
export class ChargePointUseCase {
  constructor(@Inject() private readonly userService: UserService) {}

  async execute(userId: number, amount: number): Promise<number> {
    return await this.userService.chargePoint(userId, amount);
  }
}
