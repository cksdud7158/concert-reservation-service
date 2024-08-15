import { Injectable } from "@nestjs/common";
import { Kafka, logLevel } from "kafkajs";

@Injectable()
export class KafkaInstance {
  private readonly kafka = new Kafka({
    clientId: "nestjs-client",
    brokers: this.brokers,
  });

  env = process.env.NODE_ENV;

  get brokers(): string[] {
    // 추후 env 환경에 따른 브로커 처리 주소 변경
    return ["localhost:9092"];
  }

  getKafkaInstance(): Kafka {
    return this.kafka;
  }
}
