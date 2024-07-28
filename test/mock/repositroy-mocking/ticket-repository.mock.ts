import { TicketRepositorySymbol } from "@app/domain/interface/repository/ticket.repository";

export const mockTicketRepository = {
  save: jest.fn(),
  findByIds: jest.fn(),
  findByIdsAndUserIdWithPending: jest.fn(),
  updateStatus: jest.fn(),
};

export const mockTicketProvider = {
  provide: TicketRepositorySymbol,
  useValue: mockTicketRepository,
};
