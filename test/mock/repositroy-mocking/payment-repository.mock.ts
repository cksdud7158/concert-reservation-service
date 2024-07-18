import { PaymentRepositorySymbol } from "@app/domain/interface/repository/payment.repository";

export const mockPaymentRepository = {
  insert: jest.fn(),
  findOneById: jest.fn(),
};

export const mockPaymentProvider = {
  provide: PaymentRepositorySymbol,
  useValue: mockPaymentRepository,
};
