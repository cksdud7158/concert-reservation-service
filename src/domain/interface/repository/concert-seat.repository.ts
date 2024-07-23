import { EntityManager } from "typeorm";
import ConcertSeatStatus from "@app/domain/enum/concert-seat-status.enum";
import { ConcertSeatEntity } from "@app/domain/entity/concert-seat.entity";

export const ConcertSeatRepositorySymbol = Symbol.for("ConcertSeatRepository");

export interface ConcertSeatRepository {
  findByIdWithScheduleId(
    concertScheduleId: number,
    _manager?: EntityManager,
  ): Promise<ConcertSeatEntity[]>;

  //status 가 PENDING 인것중 update_at 가 5분 지났으면 SALE 상태로 변경
  updatePendingToSale(seatId?: number, _manager?: EntityManager): Promise<void>;

  findByIdAndStatusSale(
    seatIds: number[],
    _manager?: EntityManager,
  ): Promise<ConcertSeatEntity[]>;

  updateStatus(
    seatIds: number[],
    status: ConcertSeatStatus,
    _manager?: EntityManager,
  ): Promise<void>;

  findByExpiredTime(
    seatIds: number[],
    _manager?: EntityManager,
  ): Promise<ConcertSeatEntity[]>;

  update(
    concertSeat: ConcertSeatEntity,
    _manager?: EntityManager,
  ): Promise<void>;
}
