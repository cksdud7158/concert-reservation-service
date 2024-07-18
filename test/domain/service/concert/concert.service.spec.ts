import { Test, TestingModule } from "@nestjs/testing";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import {
  ConcertScheduleRepository,
  ConcertScheduleRepositorySymbol,
} from "@app/domain/interface/repository/concert-schedule.repository";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import {
  ConcertSeatRepository,
  ConcertSeatRepositorySymbol,
} from "@app/domain/interface/repository/concert-seat.repository";
import {
  ConcertRepository,
  ConcertRepositorySymbol,
} from "@app/domain/interface/repository/concert.repository";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import ConcertScheduleStatus from "@app/infrastructure/enum/concert-seat-status.enum";
import { BadRequestException } from "@nestjs/common";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { mockConcertProvider } from "../../../mock/repositroy-mocking/concert-repository.mock";
import { mockConcertScheduleProvider } from "../../../mock/repositroy-mocking/concert-schedule-repository.mock";
import { mockConcertSeatProvider } from "../../../mock/repositroy-mocking/concert-seat-repository.mock";

describe("ConcertService", () => {
  let service: ConcertService;
  let concertScheduleRepository: jest.Mocked<ConcertScheduleRepository>;
  let concertSeatRepository: jest.Mocked<ConcertSeatRepository>;
  let concertRepository: jest.Mocked<ConcertRepository>;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertService,
        mockConcertProvider,
        mockConcertScheduleProvider,
        mockConcertSeatProvider,
      ],
    }).compile();

    service = module.get<ConcertService>(ConcertService);
    concertScheduleRepository = module.get(ConcertScheduleRepositorySymbol);
    concertSeatRepository = module.get(ConcertSeatRepositorySymbol);
    concertRepository = module.get(ConcertRepositorySymbol);
  });

  const concertId = 1;
  const date = new Date();

  const concertSchedule: Partial<ConcertSchedule> = {
    id: 1,
    creat_at: date,
    update_at: date,
    date: date,
    seats: [],
  };

  describe("콘서트 예약 가능 날짜 조회 method(getScheduleList)", () => {
    it("콘서트 날짜 조회 완료", async () => {
      // given

      //when

      jest
        .spyOn(concertScheduleRepository, "findById")
        .mockResolvedValue([concertSchedule]);
      const res = await service.getScheduleList(concertId);

      //then
      expect(res).toEqual([concertSchedule]);
    });
  });

  describe("콘서트 좌석 조회 method(getSeatList)", () => {
    it("콘서트 좌석 조회 완료", async () => {
      // given

      //when

      jest
        .spyOn(concertScheduleRepository, "findById")
        .mockResolvedValue([concertSchedule]);
      const res = await service.getScheduleList(concertId);

      //then
      expect(res).toEqual([concertSchedule]);
    });
  });

  describe("좌석들의 판매 가능 상태 조회 method(checkSaleSeat)", () => {
    const concertSeatList: ConcertSeat[] = [
      {
        id: 1,
        status: ConcertScheduleStatus.SALE,
        price: 1000,
        seat_number: 1,
        creat_at: date,
        update_at: date,
        schedule: {} as ConcertSchedule,
      },
    ];
    it("좌석들의 판매 가능 상태 조회 완료", async () => {
      // given

      //when
      const findByIdAndStatusSale = jest
        .spyOn(concertSeatRepository, "findByIdAndStatusSale")
        .mockResolvedValue(concertSeatList);

      await service.checkSaleSeat([1]);

      //then
      expect(findByIdAndStatusSale).toBeCalled();
    });
    it("조회한 ids.length 와 조회된 length 가 다름", async () => {
      // given

      //when
      const findByIdAndStatusSale = jest
        .spyOn(concertSeatRepository, "findByIdAndStatusSale")
        .mockResolvedValue([]);

      const res = service.checkSaleSeat([1]);

      //then
      expect(findByIdAndStatusSale).toBeCalled();
      await expect(res).rejects.toThrow(BadRequestException);
    });
  });

  describe("좌석들의 판매 상태 변경 method(changeStatus)", () => {
    it("좌석들의 판매 상태 변경 완료", async () => {
      // given

      //when

      const updateStatus = jest.spyOn(concertSeatRepository, "updateStatus");

      await service.changeStatus([1, 2], ConcertScheduleStatus.SOLD_OUT);

      //then
      expect(updateStatus).toBeCalled();
    });
  });

  describe("콘서트 목록 조회 method(getConcertList)", () => {
    it("콘서트 목록 조회 완료", async () => {
      // given
      const concert = {
        id: 1,
        creat_at: date,
        update_at: date,
        name: "콘서트1",
      } as Concert;

      //when
      jest.spyOn(concertRepository, "selectAll").mockResolvedValue([concert]);

      const res = await service.getConcertList();

      //then
      expect(res).toEqual([concert]);
    });
  });
});
