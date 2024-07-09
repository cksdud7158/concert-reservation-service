import { Test, TestingModule } from "@nestjs/testing";
import { ReservationController } from "@app/presentation/controller/reservation/reservation.controller";

describe("ReservationController", () => {
  let controller: ReservationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
  });

  describe("/reservation (POST)", () => {
    it("콘서트 좌석 예매 성공", async () => {
      //given
      const response = {
        reservationId: 1,
        status: 0,
        concertInfo: {
          concertId: 1,
          concertDateId: 1,
          name: "백지헌 단독 공연",
          date: 0,
          seatNum: 1,
        },
        paymentInfo: {
          paymentId: 1,
          status: 0,
          paymentPrice: 1000,
        },
      };

      //when

      //then
      const res = await controller.reserveConcert({
        concertId: 1,
        concertDataId: 1,
        seatId: 1,
      });

      expect(res).toEqual(response);
    });
  });
});
