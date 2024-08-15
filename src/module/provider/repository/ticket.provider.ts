import { TicketRepositorySymbol } from "@app/domain/interface/repository/ticket.repository";
import { TicketRepositoryImpl } from "@app/infrastructure/repository/ticket.repository.impl";

const ticketProvider = {
  provide: TicketRepositorySymbol,
  useClass: TicketRepositoryImpl,
};

export default ticketProvider;
