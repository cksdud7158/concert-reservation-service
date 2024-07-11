import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { TicketRepository } from "@app/domain/interface/repository/ticket.repository";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";

@Injectable()
export class TicketRepositoryImpl implements TicketRepository {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticket: Repository<Ticket>,
  ) {}

  async insert(
    userId: number,
    concertId: number,
    concertScheduleId: number,
    seatIds: number[],
    _manager?: EntityManager,
  ): Promise<number[]> {
    const tickets = seatIds.map((seatId) => ({
      user: { id: userId },
      schedule: { id: concertScheduleId },
      seat: { id: seatId },
      concert: { id: concertId },
    }));

    const manager = _manager ?? this.ticket.manager;
    const res = await manager
      .createQueryBuilder()
      .insert()
      .into(Ticket)
      .values(tickets)
      .execute();

    return res.identifiers.map((val) => val.id);
  }

  async findByIds(
    ticketIds: number[],
    _manager?: EntityManager,
  ): Promise<Ticket[]> {
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

    return entities;
  }
}
