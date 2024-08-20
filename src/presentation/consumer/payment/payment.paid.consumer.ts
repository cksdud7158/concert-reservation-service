import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Consumer, EachMessagePayload } from "kafkajs";
import PaymentTopicEnum from "@app/domain/enum/message/payment/payment.topic.enum";
import { KafkaInstance } from "@app/infrastructure/kafka/kafka.instance";
import { PaymentEntity } from "@app/domain/entity/payment/payment.entity";
import PaidEventStatusEnum from "@app/domain/enum/entity/paid-event-status.enum";
import { UpdatePaidEventUseCase } from "@app/application/use-case/payment/update-paid-event.use-case";

@Injectable()
export class PaymentPaidConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PaymentPaidConsumer.name);
  private readonly consumer: Consumer;

  constructor(
    @Inject() private readonly kafkaInstanceService: KafkaInstance,
    @Inject() private readonly updatePaidEventUseCase: UpdatePaidEventUseCase,
  ) {
    this.consumer = this.kafkaInstanceService.getKafkaInstance().consumer({
      groupId: "nestjs-group-paid",
    });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic: PaymentTopicEnum.PAID,
      });

      await this.consumer.run({
        // 자동으로 offset 업데이트 막기
        autoCommit: false,
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);

          // 모든 로직 끝난 후 커밋
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

    await this.updatePaidEventUseCase.execute(
      payment,
      PaidEventStatusEnum.SEND_SUCCESS,
    );

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

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }

  async disconnectConsumer() {
    await this.consumer.disconnect();
  }
}
