import { EntityManager } from "typeorm";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import ConcertSeatStatus from "@app/infrastructure/enum/concert-seat-status.enum";

export const ConcertSeatRepositorySymbol = Symbol.for("ConcertSeatRepository");

export interface ConcertSeatRepository {
  findByIdWithScheduleId(
    concertId: number,
    concertScheduleId: number,
    _manager?: EntityManager,
  ): Promise<ConcertSeat[]>;

  //status 가 PENDING 인것중 update_at 가 5분 지났으면 SALE 상태로 변경
  updatePendingToSale(seatId?: number, _manager?: EntityManager): Promise<void>;

  findByIdAndStatusSale(
    seatIds: number[],
    _manager?: EntityManager,
  ): Promise<ConcertSeat[]>;

  updateStatus(
    seatIds: number[],
    status: ConcertSeatStatus,
    _manager?: EntityManager,
  ): Promise<void>;

  findByExpiredTime(
    seatIds: number[],
    _manager?: EntityManager,
  ): Promise<ConcertSeat[]>;
}
