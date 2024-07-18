import { PointHistoryRepositorySymbol } from "@app/domain/interface/repository/point-history.repository";

export const mockPointHistoryRepository = {
  insert: jest.fn(),
};

export const mockPointHistoryProvider = {
  provide: PointHistoryRepositorySymbol,
  useValue: mockPointHistoryRepository,
};
