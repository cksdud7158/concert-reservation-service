import { WaitingQueueRepositorySymbol } from "@app/domain/interface/repository/waiting-queue.repository";

export const mockWaitingQueueRepository = {
  save: jest.fn(),
  findByNotExpiredStatus: jest.fn(),
  updateStatusToExpired: jest.fn(),
  findOneById: jest.fn(),
  updateEntities: jest.fn(),
  updateStatusByUserId: jest.fn(),
};

export const mockWaitingQueueProvider = {
  provide: WaitingQueueRepositorySymbol,
  useValue: mockWaitingQueueRepository,
};
