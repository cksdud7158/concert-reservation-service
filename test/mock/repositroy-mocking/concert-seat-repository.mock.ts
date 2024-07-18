import { ConcertSeatRepositorySymbol } from "@app/domain/interface/repository/concert-seat.repository";

export const mockConcertSeatRepository = {
  findByIdWithScheduleId: jest.fn(),
  updatePendingToSale: jest.fn(),
  findByIdAndStatusSale: jest.fn(),
  updateStatus: jest.fn(),
  findByExpiredTime: jest.fn(),
};

export const mockConcertSeatProvider = {
  provide: ConcertSeatRepositorySymbol,
  useValue: mockConcertSeatRepository,
};
