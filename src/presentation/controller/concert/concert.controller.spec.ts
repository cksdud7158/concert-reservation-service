import { Test, TestingModule } from "@nestjs/testing";
import { ConcertController } from "@app/presentation/controller/concert/concert.controller";

describe("ConcertController", () => {
  let controller: ConcertController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertController],
    }).compile();

    controller = module.get<ConcertController>(ConcertController);
  });

  const concertId = 1;
  const concertDateId = 1;
  const seatId = 1;
  const seatNum = 1;
  describe("/concerts/{concertId}/dates (GET)", () => {
    it("콘서트 예약 가능 날짜 조회 성공", async () => {
      //given
      const response = {
        total: 1,
        dates: [
          {
            concertDateId: 1,
            date: 0,
            isSoldOut: false,
          },
        ],
      };

      //when

      //then
      const res = await controller.getDateList(concertId);

      expect(res).toEqual(response);
    });
  });

  describe("/concerts/{concertId}/dates/{concertDateId}/seats (GET)", () => {
    it("콘서트 좌석 정보 조회 성공", async () => {
      //given
      const response = {
        seats: [
          {
            seatId,
            seatNum,
            isReserved: false,
          },
        ],
      };

      //when

      //then
      const res = await controller.getSeatList(concertId, concertDateId);

      expect(res).toEqual(response);
    });
  });
});
