import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Consumer, EachMessagePayload } from "kafkajs";
import TestTopicEnum from "@app/domain/enum/message/test/test.topic.enum";
import { KafkaInstance } from "@app/infrastructure/kafka/kafka.instance";

@Injectable()
export class TestConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TestConsumer.name);
  private readonly consumer: Consumer;

  constructor(@Inject() private readonly kafkaInstanceService: KafkaInstance) {
    this.consumer = this.kafkaInstanceService.kafkaInstance.consumer({
      groupId: "nestjs-group-test",
    });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      // await this.consumer.subscribe({
      //   topic: TestTopicEnum.TEST_TOPIC,
      //   fromBeginning: true,
      // });
      //
      // await this.consumer.run({
      //   eachMessage: async (payload: EachMessagePayload) => {
      //     await this.handleMessage(payload);
      //   },
      // });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async handleMessage(payload: EachMessagePayload) {
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
