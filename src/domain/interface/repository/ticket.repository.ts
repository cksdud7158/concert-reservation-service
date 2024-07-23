import { EntityManager } from "typeorm";
import { TicketEntity } from "@app/domain/entity/ticket.entity";

export const TicketRepositorySymbol = Symbol.for("TicketRepository");

export interface TicketRepository {
  save(
    tickets: TicketEntity[],
    _manager?: EntityManager,
  ): Promise<TicketEntity[]>;

  findByIds(
    ticketIds: number[],
    _manager?: EntityManager,
  ): Promise<TicketEntity[]>;

  findByIdsAndUserId(
    userId: number,
    ticketIds: number[],
    _manager?: EntityManager,
  ): Promise<TicketEntity[]>;
}
