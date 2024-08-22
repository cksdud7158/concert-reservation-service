import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Admin, Kafka } from "kafkajs";
import PaymentTopicEnum from "@app/domain/enum/message/payment/payment.topic.enum";

@Injectable()
export class KafkaInstance implements OnModuleInit {
  private readonly logger = new Logger(KafkaInstance.name);

  private readonly kafka = new Kafka({
    clientId: "nestjs-client",
    brokers: this.brokers,
  });

  env = process.env.NODE_ENV;

  get brokers(): string[] {
    // 추후 env 환경에 따른 브로커 처리 주소 변경
    return ["kafka:9092"];
  }

  get kafkaInstance(): Kafka {
    return this.kafka;
  }

  get admin(): Admin {
    return this.kafka.admin();
  }

  async onModuleInit() {
    await this.createTopic(PaymentTopicEnum.PAID);
  }

  async createTopic(topicName: string) {
    await this.admin.connect();
    const topics = await this.admin.listTopics();

    if (!topics.includes(topicName)) {
      await this.admin.createTopics({
        topics: [
          {
            topic: topicName,
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
      this.logger.log(`Topic "${topicName}" created successfully.`);
    } else {
      this.logger.log(`Topic "${topicName}" already exists.`);
    }

    await this.admin.disconnect();
  }
}
