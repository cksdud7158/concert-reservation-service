import { ConcertRepositorySymbol } from "@app/domain/interface/repository/concert.repository";
export const mockConcertRepository = {
  findById: jest.fn(),
  selectAll: jest.fn(),
};

export const mockConcertProvider = {
  provide: ConcertRepositorySymbol,
  useValue: mockConcertRepository,
};
