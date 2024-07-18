import { UserRepositorySymbol } from "@app/domain/interface/repository/user.repository";

export const mockUserRepository = {
  findOneById: jest.fn(),
  findOnePointById: jest.fn(),
  updatePoint: jest.fn(),
};

export const mockUserProvider = {
  provide: UserRepositorySymbol,
  useValue: mockUserRepository,
};
