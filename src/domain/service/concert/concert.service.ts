import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import {
  ConcertScheduleRepository,
  ConcertScheduleRepositorySymbol,
} from "@app/domain/interface/repository/concert-schedule.repository";
import {
  ConcertSeatRepository,
  ConcertSeatRepositorySymbol,
} from "@app/domain/interface/repository/concert-seat.repository";
import {
  ConcertRepository,
  ConcertRepositorySymbol,
} from "@app/domain/interface/repository/concert.repository";
import { DataSource, EntityManager } from "typeorm";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";
import { ConcertEntity } from "@app/domain/entity/concert.entity";
import { ConcertSeatEntity } from "@app/domain/entity/concert-seat.entity";
import ConcertSeatStatus from "@app/domain/enum/entity/concert-seat-status.enum";
import {
  ConcertScheduleCacheRepository,
  ConcertScheduleCacheRepositorySymbol,
} from "@app/domain/interface/cache/concert-schedule.cache.repository";

@Injectable()
export class ConcertService {
  constructor(
    @Inject(ConcertRepositorySymbol)
    private readonly concertRepository: ConcertRepository,
    @Inject(ConcertScheduleRepositorySymbol)
    private readonly concertScheduleRepository: ConcertScheduleRepository,
    @Inject(ConcertScheduleCacheRepositorySymbol)
    private readonly concertScheduleCacheRepository: ConcertScheduleCacheRepository,
    @Inject(ConcertSeatRepositorySymbol)
    private readonly concertSeatRepository: ConcertSeatRepository,
    private readonly dataSource: DataSource,
  ) {}

  // 콘서트 목록 조회
  async getConcertList(): Promise<ConcertEntity[]> {
    return await this.concertRepository.selectAll();
  }

  //좌석들의 판매 가능 상태 조회
  async checkSaleSeat(
    seatIds: number[],
    _manager?: EntityManager,
  ): Promise<ConcertSeatEntity[]> {
    const concertSeatList =
      await this.concertSeatRepository.findByIdAndStatusSale(seatIds, _manager);
    if (seatIds.length !== concertSeatList.length) {
      throw new BadRequestException("이미 판매된 좌석입니다.");
    }

    return concertSeatList;
  }

  // 좌석들의 판매 상태 변경
  async changeSeatStatus(
    concertSeatEntities: ConcertSeatEntity[],
    status: ConcertSeatStatus,
    _manager?: EntityManager,
  ): Promise<void> {
    concertSeatEntities.forEach((seat) => {
      seat.status = status;
      this.concertSeatRepository.updateStatus(seat, _manager);
    });
  }

  // 일정 리스트 조회
  async getScheduleList(concertId: number): Promise<ConcertScheduleEntity[]> {
    // 캐시 조회
    let concertScheduleEntityList =
      await this.concertScheduleCacheRepository.findById(concertId);

    // 있으면 캐시 데이터 리턴
    if (concertScheduleEntityList) {
      return concertScheduleEntityList;
    }

    // 없으면 DB 조회 및 캐시 설정
    concertScheduleEntityList =
      await this.concertScheduleRepository.findById(concertId);

    this.concertScheduleCacheRepository.insert(
      concertId,
      concertScheduleEntityList,
    );

    return concertScheduleEntityList;
  }

  // 좌석 리스트 조회
  async getSeatList(concertScheduleId: number): Promise<ConcertSeatEntity[]> {
    // status 가 PENDING 인것중 update_at 가 5분 지났으면 SALE 상태로 변경
    await this.concertSeatRepository.updatePendingToSale();

    return this.concertSeatRepository.findByIdWithScheduleId(concertScheduleId);
  }

  // 구매 가능 여부 체크
  async checkExpiredTime(
    seatIds: number[],
    _manager?: EntityManager,
  ): Promise<void> {
    console.log("checkExpiredTime");
    // 5분이 지났는가 확인
    const seatList = await this.concertSeatRepository.findByExpiredTime(
      seatIds,
      _manager,
    );

    // 지났으면 SALE 로 변경 및 에러 처리
    if (seatList.length) {
      await this.dataSource
        .createEntityManager()
        .transaction(async (manager) => {
          seatList.forEach((seat) => {
            seat.status = ConcertSeatStatus.SALE;
            this.concertSeatRepository.updateStatus(seat, manager);
          });
        });

      throw new BadRequestException("5분이 지나 구매가 불가능합니다.");
    }
  }
}
