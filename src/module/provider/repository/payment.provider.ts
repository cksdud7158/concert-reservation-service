import { PaymentRepositorySymbol } from "@app/domain/interface/repository/payment.repository";
import { PaymentRepositoryImpl } from "@app/infrastructure/repository/payment.repository.impl";

const paymentProvider = {
  provide: PaymentRepositorySymbol,
  useClass: PaymentRepositoryImpl,
};

export default paymentProvider;
