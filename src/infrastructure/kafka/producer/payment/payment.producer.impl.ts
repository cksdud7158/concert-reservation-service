import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Producer } from "kafkajs";
import PaymentTopicEnum from "@app/domain/enum/message/payment/payment.topic.enum";
import { MessageType } from "@app/domain/type/message/producer.type";
import { KafkaInstance } from "@app/infrastructure/kafka/kafka.instance";
import { PaymentProducer } from "@app/domain/interface/message/payment/payment.producer";

@Injectable()
export class PaymentProducerImpl
  implements PaymentProducer, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PaymentProducerImpl.name);
  private readonly producer: Producer;

  constructor(@Inject() private readonly kafkaInstanceService: KafkaInstance) {
    this.producer = this.kafkaInstanceService.kafkaInstance.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async sendMessage(topic: PaymentTopicEnum, message: MessageType) {
    try {
      // 메시지 발행
      const res = await this.producer.send({
        topic,
        messages: [message],
        acks: -1,
      });
      this.logger.log(
        `Message sent to topic "${topic}": ${message}, metaData : ${JSON.stringify(res)}`,
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
