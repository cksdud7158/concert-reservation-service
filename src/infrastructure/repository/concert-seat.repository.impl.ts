import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { ConcertSeatRepository } from "@app/domain/interface/repository/concert-seat.repository";
import ConcertScheduleStatus from "@app/domain/enum/concert-seat-status.enum";
import ConcertSeatStatus from "@app/domain/enum/concert-seat-status.enum";
import { ConcertSeatEntity } from "@app/domain/entity/concert-seat.entity";
import ConcertSeatMapper from "@app/infrastructure/mapper/concert-seat.mapper";

@Injectable()
export class ConcertSeatRepositoryImpl implements ConcertSeatRepository {
  constructor(
    @InjectRepository(ConcertSeat)
    private readonly concertSeat: Repository<ConcertSeat>,
  ) {}

  async findByIdWithScheduleId(
    concertScheduleId: number,
    _manager?: EntityManager,
  ): Promise<ConcertSeatEntity[]> {
    const manager = _manager ?? this.concertSeat.manager;
    const entities = await manager.find(ConcertSeat, {
      where: {
        schedule: {
          id: concertScheduleId,
        },
      },
      order: {
        seat_number: "ASC",
      },
    });

    return entities.map((seat) => ConcertSeatMapper.toDomain(seat));
  }

  async updatePendingToSale(
    seatId?: number,
    _manager?: EntityManager,
  ): Promise<void> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const manager = _manager ?? this.concertSeat.manager;
    const builder = await manager
      .createQueryBuilder()
      .update(ConcertSeat)
      .set({ status: ConcertScheduleStatus.SALE })
      .where("status = :status", { status: ConcertScheduleStatus.PENDING })
      .andWhere("update_at < :date", { date: fiveMinutesAgo.toISOString() });
    if (seatId) {
      builder.andWhere("id = :id", { id: seatId });
    }

    await builder.execute();
  }

  async findByIdAndStatusSale(
    seatIds: number[],
    _manager?: EntityManager,
  ): Promise<ConcertSeatEntity[]> {
    const manager = _manager ?? this.concertSeat.manager;
    const entities = await manager.find(ConcertSeat, {
      where: {
        id: In(seatIds),
        status: ConcertScheduleStatus.SALE,
      },
    });

    return entities.map((seat) => ConcertSeatMapper.toDomain(seat));
  }

  async updateStatus(
    seatIds: number[],
    status: ConcertSeatStatus,
    _manager?: EntityManager,
  ): Promise<void> {
    const manager = _manager ?? this.concertSeat.manager;
    await manager
      .createQueryBuilder()
      .update(ConcertSeat)
      .set({ status: status })
      .where("id IN (:...seatIds)", { seatIds: seatIds })
      .execute();
  }

  async findByExpiredTime(
    seatIds: number[],
    _manager?: EntityManager,
  ): Promise<ConcertSeatEntity[]> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const manager = _manager ?? this.concertSeat.manager;
    const entities = await manager
      .createQueryBuilder(ConcertSeat, "seat")
      .select()
      .where("id IN (:...seatIds)", { seatIds: seatIds })
      .andWhere("status = :status", { status: ConcertScheduleStatus.PENDING })
      .andWhere("update_at < :date", { date: fiveMinutesAgo.toISOString() })
      .execute();

    return entities.map((seat) => ConcertSeatMapper.toDomain(seat));
  }

  async update(
    concertSeat: ConcertSeatEntity,
    _manager?: EntityManager,
  ): Promise<void> {
    const manager = _manager ?? this.concertSeat.manager;
    const res = await manager
      .createQueryBuilder(ConcertSeat, "seat")
      .update(ConcertSeat)
      .set({
        status: concertSeat.status,
        price: concertSeat.price,
        seat_number: concertSeat.seat_number,
      })
      .where("id = :id", { id: concertSeat.id })
      .execute();

    if (res.affected === 0) {
      throw new Error(
        "Update failed due to version mismatch or user not found",
      );
    }
  }
}
