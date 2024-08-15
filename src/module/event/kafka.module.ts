import { Module } from "@nestjs/common";
import testProducerProvider from "@app/module/provider/message/test/test.producer.provider";
import { KafkaInstance } from "@app/infrastructure/kafka/kafka.instance";
import { TestConsumer } from "@app/presentation/consumer/test/test.consumer";

@Module({
  providers: [testProducerProvider, TestConsumer, KafkaInstance],
  exports: [KafkaInstance, testProducerProvider],
})
export class KafkaModule {}
