import { ConcertScheduleCacheRepositorySymbol } from "@app/domain/interface/cache/concert-schedule.cache.repository";

export const mockConcertScheduleCacheRepository = {
  findById: jest.fn(),
  insert: jest.fn(),
};

export const mockConcertScheduleCacheProvider = {
  provide: ConcertScheduleCacheRepositorySymbol,
  useValue: mockConcertScheduleCacheRepository,
};
