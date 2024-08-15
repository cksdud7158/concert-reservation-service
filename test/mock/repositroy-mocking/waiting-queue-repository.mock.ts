import { WaitingQueueRepositorySymbol } from "@app/domain/interface/repository/waiting-queue.repository";

export const mockWaitingQueueRepository = {
  isMemoryUsageHigh: jest.fn(),
  hasActiveUser: jest.fn(),
  setActiveUser: jest.fn(),
  removeActiveUser: jest.fn(),
  setWaitingUser: jest.fn(),
  getWaitingNum: jest.fn(),
  getWaitingUsers: jest.fn(),
  removeWaitingUsers: jest.fn(),
};

export const mockWaitingQueueProvider = {
  provide: WaitingQueueRepositorySymbol,
  useValue: mockWaitingQueueRepository,
};
