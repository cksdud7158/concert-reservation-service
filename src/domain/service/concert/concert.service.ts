import { BadRequestException, Inject, Injectable } from "@nestjs/common";
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
import {
  ConcertRepository,
  ConcertRepositorySymbol,
} from "@app/domain/interface/repository/concert.repository";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import ConcertSeatStatus from "@app/infrastructure/enum/concert-seat-status.enum";
import { EntityManager } from "typeorm";

@Injectable()
export class ConcertService {
  constructor(
    @Inject(ConcertRepositorySymbol)
    private readonly concertRepository: ConcertRepository,
    @Inject(ConcertScheduleRepositorySymbol)
    private readonly concertScheduleRepository: ConcertScheduleRepository,
    @Inject(ConcertSeatRepositorySymbol)
    private readonly concertSeatRepository: ConcertSeatRepository,
  ) {}

  // 콘서트 목록 조회
  async getConcertList(): Promise<Concert[]> {
    return await this.concertRepository.selectAll();
  }

  //콘서트 정보 조회
  async getConcert(concertId: number): Promise<Concert> {
    return this.concertRepository.findById(concertId);
  }

  //좌석들의 판매 가능 상태 조회
  async checkSaleSeat(seatIds: number[]): Promise<void> {
    const concertSeatList =
      await this.concertSeatRepository.findByIdAndStatusSale(seatIds);
    if (seatIds.length !== concertSeatList.length) {
      throw new BadRequestException("이미 판매된 좌석입니다.");
    }
  }

  // 좌석들의 판매 상태 변경
  async changeStatus(
    seatIds: number[],
    status: ConcertSeatStatus,
    _manager?: EntityManager,
  ): Promise<void> {
    await this.concertSeatRepository.updateStatus(seatIds, status, _manager);
  }

  // 일정 리스트 조회
  async getScheduleList(
    concertId: number,
  ): Promise<Partial<ConcertSchedule>[]> {
    return this.concertScheduleRepository.findById(concertId);
  }

  // 좌석 리스트 조회
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

  // 구매 가능 여부 체크
  async checkExpiredTime(seatIds: number[]): Promise<void> {
    // 5분이 지났는가 확인
    const seatList =
      await this.concertSeatRepository.findByExpiredTime(seatIds);

    // 지났으면 SALE 로 변경 및 에러 처리
    if (seatList.length) {
      throw new BadRequestException("5분이 지나 구매가 불가능합니다.");
    }
  }
}
