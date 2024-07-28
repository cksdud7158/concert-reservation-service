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

    const entities = await manager
      .createQueryBuilder(Ticket, "ticket")
      .where("ticket.id IN (:...ticketIds)", { ticketIds })
      .andWhere("ticket.status = :status", { status: TicketStatus.PENDING })
      .setLock("pessimistic_write")
      .getMany();

    // 조인된 테이블의 데이터 별도로 가져오기
    const detailedTickets = await manager
      .createQueryBuilder(Ticket, "ticket")
      .leftJoinAndSelect("ticket.concert", "concert")
      .leftJoinAndSelect("ticket.schedule", "schedule")
      .leftJoinAndSelect("ticket.seat", "seat")
      .leftJoinAndSelect("ticket.user", "user")
      .where("ticket.id IN (:...ticketIds)", { ticketIds })
      .andWhere("ticket.status = :status", { status: TicketStatus.PENDING })
      .getMany();

    return entities.map((ticket, index) => {
      ticket.concert = detailedTickets[index].concert;
      ticket.schedule = detailedTickets[index].schedule;
      ticket.seat = detailedTickets[index].seat;
      ticket.user = detailedTickets[index].user;
      return TicketMapper.toDomain(ticket);
    });
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
      .andWhere("version = :version", { version: ticket.version }) // 버전 비교
      .execute();

    if (res.affected === 0) {
      throw new Error(
        "Update failed due to version mismatch or user not found",
      );
    }
  }
}
