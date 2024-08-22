export const WaitingQueueRepositorySymbol = Symbol.for(
  "WaitingQueueRepository",
);

export interface WaitingQueueRepository {
  isRequestAllowed(): Promise<boolean>;
  hasActiveUser(userId: number): Promise<boolean>;
  setActiveUser(userId: number): Promise<void>;
  removeActiveUser(userId: number): Promise<void>;
  setWaitingUser(userId: number): Promise<void>;
  getWaitingNum(userId: number): Promise<number>;
  getWaitingUsers(maxNum: number): Promise<number[]>;
  removeWaitingUsers(userIds: number[]): Promise<void>;
}
