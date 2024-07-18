import { TicketRepositorySymbol } from "@app/domain/interface/repository/ticket.repository";

export const mockTicketRepository = {
  insert: jest.fn(),
  findByIds: jest.fn(),
  findByIdsAndUserId: jest.fn(),
};

export const mockTicketProvider = {
  provide: TicketRepositorySymbol,
  useValue: mockTicketRepository,
};
