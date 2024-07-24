import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { TicketRepository } from "@app/domain/interface/repository/ticket.repository";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import { TicketEntity } from "@app/domain/entity/ticket.entity";
import TicketMapper from "@app/infrastructure/mapper/ticket.mapper";
import TicketStatus from "@app/domain/enum/ticket-status.enum";

@Injectable()
export class TicketRepositoryImpl implements TicketRepository {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticket: Repository<Ticket>,
  ) {}

  async save(
    tickets: TicketEntity[],
    _manager?: EntityManager,
  ): Promise<TicketEntity[]> {
    const manager = _manager ?? this.ticket.manager;
    const entities = await manager.save(Ticket, tickets);

    return entities.map((entity) => TicketMapper.toDomain(entity));
  }

  async findByIds(
    ticketIds: number[],
    _manager?: EntityManager,
  ): Promise<TicketEntity[]> {
    const manager = _manager ?? this.ticket.manager;

    const entities = await manager.find(Ticket, {
      where: {
        id: In(ticketIds),
      },
      relations: {
        concert: true,
        schedule: true,
        seat: true,
      },
    });

    return entities.map((ticket) => TicketMapper.toDomain(ticket));
  }

  async findByIdsAndUserIdWithPending(
    userId: number,
    ticketIds: number[],
    _manager?: EntityManager,
  ): Promise<TicketEntity[]> {
    const manager = _manager ?? this.ticket.manager;

    const entities = await manager.find(Ticket, {
      where: {
        id: In(ticketIds),
        status: TicketStatus.PENDING,
        user: {
          id: userId,
        },
      },
      relations: {
        concert: true,
        schedule: true,
        seat: true,
      },
    });

    return entities.map((ticket) => TicketMapper.toDomain(ticket));
  }

  async updateStatus(
    ticket: TicketEntity,
    _manager?: EntityManager,
  ): Promise<void> {
    const manager = _manager ?? this.ticket.manager;
    const res = await manager
      .createQueryBuilder(Ticket, "ticket")
      .update(Ticket)
      .set({
        status: ticket.status,
      })
      .where("id = :id", { id: ticket.id })
      .andWhere("version = :version", { version: ticket.version })
      .execute();

    if (res.affected === 0) {
      throw new Error(
        "Update failed due to version mismatch or user not found",
      );
    }
  }
}
