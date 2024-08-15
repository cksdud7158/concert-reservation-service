import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { Consumer, EachMessagePayload } from "kafkajs";
import PaymentTopicEnum from "@app/domain/enum/message/payment/payment.topic.enum";
import { KafkaInstance } from "@app/infrastructure/kafka/kafka.instance";
import { PaymentEntity } from "@app/domain/entity/payment/payment.entity";
import { ExpireTokenUseCase } from "@app/application/use-case/token/expire-token.use-case";

@Injectable()
export class TokenExpireConsumer implements OnModuleInit {
  private readonly logger = new Logger(TokenExpireConsumer.name);
  private readonly consumer: Consumer;

  constructor(
    @Inject() private readonly kafkaInstanceService: KafkaInstance,
    @Inject() private readonly expireTokenUseCase: ExpireTokenUseCase,
  ) {
    this.consumer = this.kafkaInstanceService.getKafkaInstance().consumer({
      groupId: "nestjs-group-token-expired",
    });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic: PaymentTopicEnum.PAID,
      });

      await this.consumer.run({
        autoCommit: false,

        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
          await this.consumer.commitOffsets([
            {
              topic: payload.topic,
              partition: payload.partition,
              offset: (Number(payload.message.offset) + 1).toString(),
            },
          ]);
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async handleMessage(payload: EachMessagePayload) {
    const payment: PaymentEntity = JSON.parse(payload.message.value.toString());

    await this.expireTokenUseCase.execute(payment.user.id);

    this.logger.log({
      topic: payload.topic,
      partition: payload.partition,
      offset: payload.message.offset,
      key: payload.message.key ? payload.message.key.toString() : undefined,
      value: payload.message.value
        ? payload.message.value.toString()
        : undefined,
    });
  }
}
