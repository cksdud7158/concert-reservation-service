import { PaymentProducerSymbol } from "@app/domain/interface/message/payment/payment.producer";
import { PaymentProducerImpl } from "@app/infrastructure/kafka/producer/payment/payment.producer.impl";

const paymentProducerProvider = {
  provide: PaymentProducerSymbol,
  useClass: PaymentProducerImpl,
};
export default paymentProducerProvider;
