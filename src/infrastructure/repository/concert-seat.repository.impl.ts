import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { ConcertSeatRepository } from "@app/domain/interface/repository/concert-seat.repository";
import ConcertScheduleStatus from "@app/domain/enum/entity/concert-seat-status.enum";
import { ConcertSeatEntity } from "@app/domain/entity/concert/concert-seat.entity";
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
    const entities = await manager
      .createQueryBuilder()
      .select()
      .from(ConcertSeat, "seat")
      .where("seat.schedule_id = :schedule_id", {
        schedule_id: concertScheduleId,
      })
      .orderBy("seat_number", "ASC")
      .execute();

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
    const entities = await manager
      .createQueryBuilder()
      .select()
      .from(ConcertSeat, "seat")
      .where("id IN (:...seatIds)", { seatIds: seatIds })
      .andWhere("status = :status", { status: ConcertScheduleStatus.SALE })
      .execute();

    return entities.map((seat) => ConcertSeatMapper.toDomain(seat));
  }

  async updateStatus(
    concertSeat: ConcertSeatEntity,
    _manager?: EntityManager,
  ): Promise<void> {
    const manager = _manager ?? this.concertSeat.manager;
    const res = await manager
      .createQueryBuilder(ConcertSeat, "seat")
      .update(ConcertSeat)
      .set({
        status: concertSeat.status,
      })
      .where("id = :id", { id: concertSeat.id })
      .andWhere("version = :version", { version: concertSeat.version }) // 버전 비교
      .execute();

    if (res.affected === 0) {
      throw new Error(
        "Update failed due to version mismatch or user not found",
      );
    }
  }

  async findByExpiredTime(
    seatIds: number[],
    _manager?: EntityManager,
  ): Promise<ConcertSeatEntity[]> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const manager = _manager ?? this.concertSeat.manager;
    const entities = await manager
      .createQueryBuilder(ConcertSeat, "seat")
      .select(["seat.id"])
      .where("id IN (:...seatIds)", { seatIds: seatIds })
      .andWhere("status = :status", { status: ConcertScheduleStatus.PENDING })
      .andWhere("update_at < :date", { date: fiveMinutesAgo.toISOString() })
      .execute();

    return entities.map((seat) => ConcertSeatMapper.toDomain(seat));
  }
}
