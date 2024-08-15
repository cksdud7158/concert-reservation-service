import { Module } from "@nestjs/common";
import testProducerProvider from "@app/module/provider/message/test/test.producer.provider";
import { KafkaInstance } from "@app/infrastructure/kafka/kafka.instance";
import { TestConsumer } from "@app/presentation/consumer/test/test.consumer";
import paymentProducerProvider from "@app/module/provider/message/payment/payment.producer.provider";

@Module({
  providers: [
    testProducerProvider,
    paymentProducerProvider,

    TestConsumer,
    KafkaInstance,
  ],
  exports: [KafkaInstance, testProducerProvider, paymentProducerProvider],
})
export class KafkaModule {}
