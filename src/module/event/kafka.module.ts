import { forwardRef, Module } from "@nestjs/common";
import testProducerProvider from "@app/module/provider/message/test/test.producer.provider";
import { KafkaInstance } from "@app/infrastructure/kafka/kafka.instance";
import { TestConsumer } from "@app/presentation/consumer/test/test.consumer";
import paymentProducerProvider from "@app/module/provider/message/payment/payment.producer.provider";
import { PaymentPaidConsumer } from "@app/presentation/consumer/payment/payment.paid.consumer";
import { PaymentModule } from "@app/module/payment/payment.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaidEvent } from "@app/infrastructure/entity/paid-event.entity";
import { TokenExpireConsumer } from "@app/presentation/consumer/payment/token-expire.consumer";
import { TokenModule } from "@app/module/token/token.module";

@Module({
  imports: [
    forwardRef(() => PaymentModule),
    forwardRef(() => TokenModule),
    TypeOrmModule.forFeature([PaidEvent]),
  ],
  providers: [
    KafkaInstance,
    testProducerProvider,
    paymentProducerProvider,
    PaymentPaidConsumer,
    TokenExpireConsumer,
    TestConsumer,
  ],
  exports: [testProducerProvider, paymentProducerProvider],
})
export class KafkaModule {}
