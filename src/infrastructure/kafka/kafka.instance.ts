import { Injectable } from "@nestjs/common";
import { Kafka } from "kafkajs";

@Injectable()
export class KafkaInstance {
  private readonly kafka = new Kafka({
    clientId: "nestjs-client",
    brokers: ["localhost:9092"],
  });

  getKafkaInstance(): Kafka {
    return this.kafka;
  }
}
