export const WaitingQueueRepositorySymbol = Symbol.for(
  "WaitingQueueRepository",
);

export interface WaitingQueueRepository {
  getActiveNum(): Promise<number>;
  setActiveNum(num: number): Promise<void>;
  hasActiveData(userId: number): Promise<void>;
  setActiveData(userId: number): Promise<void>;
  setWaitingData(userId: number): Promise<void>;
  getWaitingNum(userId: number): Promise<number>;
}
