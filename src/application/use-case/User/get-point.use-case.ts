import { Inject, Injectable } from "@nestjs/common";
import { UserService } from "../../../domain/service/user/user.service";

@Injectable()
export class GetPointUseCase {
  constructor(@Inject() private readonly userService: UserService) {}

  async execute(userId: number): Promise<number> {
    return await this.userService.getPoint(userId);
  }
}
