import { Inject, Injectable } from "@nestjs/common";
import { UserService } from "@app/domain/service/user/user.service";
import { TokenService } from "@app/domain/service/token/token.service";
import { PayCompletedEvent } from "@app/presentation/event/payment/pay-completed.event";
import { EventBus } from "@nestjs/cqrs";
import { PaymentEntity } from "@app/domain/entity/payment.entity";

@Injectable()
export class GetTokenUseCase {
  constructor(
    @Inject() private readonly tokenService: TokenService,
    @Inject() private readonly userService: UserService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(userId: number): Promise<string> {
    // 해당 유저 있는지 확인
    await this.userService.hasUser(userId);
    this.eventBus.publish(new PayCompletedEvent(new PaymentEntity({ id: 1 })));
    return await this.tokenService.getToken(userId);
  }
}
