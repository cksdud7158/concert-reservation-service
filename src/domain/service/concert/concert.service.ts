import { Inject, Injectable } from "@nestjs/common";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import {
  ConcertScheduleRepository,
  ConcertScheduleRepositorySymbol,
} from "@app/domain/interface/repository/concert-schedule.repository";
import {
  ConcertSeatRepository,
  ConcertSeatRepositorySymbol,
} from "@app/domain/interface/repository/concert-seat.repository";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";

@Injectable()
export class ConcertService {
  constructor(
    @Inject(ConcertScheduleRepositorySymbol)
    private readonly concertScheduleRepository: ConcertScheduleRepository,
    @Inject(ConcertSeatRepositorySymbol)
    private readonly concertSeatRepository: ConcertSeatRepository,
  ) {}

  async getScheduleList(
    concertId: number,
  ): Promise<Partial<ConcertSchedule>[]> {
    return this.concertScheduleRepository.findById(concertId);
  }

  async getSeatList(
    concertId: number,
    concertScheduleId: number,
  ): Promise<ConcertSeat[]> {
    // status 가 PENDING 인것중 update_at 가 5분 지났으면 SALE 상태로 변경
    await this.concertSeatRepository.updatePendingToSale();

    return this.concertSeatRepository.findByIdWithScheduleId(
      concertId,
      concertScheduleId,
    );
  }
}
