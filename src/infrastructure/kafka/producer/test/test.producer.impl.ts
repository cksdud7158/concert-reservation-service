import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Producer } from "kafkajs";
import { KafkaInstance } from "@app/infrastructure/kafka/kafka.instance";
import TestTopicEnum from "@app/domain/enum/message/test/test.topic.enum";
import { MessageType } from "@app/domain/type/message/producer.type";

@Injectable()
export class TestProducerImpl implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TestProducerImpl.name);
  private readonly producer: Producer;

  constructor(@Inject() private readonly kafkaInstanceService: KafkaInstance) {
    this.producer = this.kafkaInstanceService.getKafkaInstance().producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async sendMessage(topic: TestTopicEnum, message: MessageType) {
    try {
      const res = await this.producer.send({
        topic,
        //결제 완료 이벤트에 대한 순정 보장은 필요 없으므로 key 사용 X
        messages: [message],
      });
      this.logger.log(
        `Message sent to topic "${topic}": ${JSON.stringify(message)}, metaData : ${JSON.stringify(res)}`,
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
