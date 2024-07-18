import { DataSource } from "typeorm";

export const datasourceProvider = {
  provide: DataSource,
  useValue: {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {},
    }),
  },
};
