import { TestProducerSymbol } from "@app/domain/interface/message/test/test.producer";
import { TestProducerImpl } from "@app/infrastructure/kafka/producer/test/test.producer.impl";

const testProducerProvider = {
  provide: TestProducerSymbol,
  useClass: TestProducerImpl,
};
export default testProducerProvider;
