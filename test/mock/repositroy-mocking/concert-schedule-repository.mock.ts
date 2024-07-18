import { ConcertScheduleRepositorySymbol } from "@app/domain/interface/repository/concert-schedule.repository";

export const mockConcertScheduleRepository = {
  findById: jest.fn(),
};

export const mockConcertScheduleProvider = {
  provide: ConcertScheduleRepositorySymbol,
  useValue: mockConcertScheduleRepository,
};
