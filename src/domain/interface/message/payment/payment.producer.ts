import PaymentTopicEnum from "@app/domain/enum/message/payment/payment.topic.enum";
import { MessageType } from "@app/domain/type/message/producer.type";

export const PaymentProducerSymbol = Symbol.for("PaymentProducer");

export interface PaymentProducer {
  sendMessage(topic: PaymentTopicEnum, message: MessageType): Promise<void>;
}
