import TestTopicEnum from "@app/domain/enum/message/test/test.topic.enum";
import { MessageType } from "@app/domain/type/message/producer.type";

export const TestProducerSymbol = Symbol.for("TestProducer");

export interface TestProducer {
  sendMessage(topic: TestTopicEnum, message: MessageType): Promise<void>;
}
