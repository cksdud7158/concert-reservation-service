export const WaitingQueueRepositorySymbol = Symbol.for(
  "WaitingQueueRepository",
);

export interface WaitingQueueRepository {
  getActiveNum(): Promise<number>;

  setActiveData(userId: number): Promise<void>;
  setActiveNum(num: number): Promise<void>;
  setWaitingData(userId: number): Promise<void>;

  getWaitingNum(userId: number): Promise<number>;
}
