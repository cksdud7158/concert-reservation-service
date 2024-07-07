import { Body, Controller, Post } from "@nestjs/common";
import { ReserveConcertRequest } from "../../dto/reservation/dto/request/reserve-concert.request";

@Controller("reservation")
export class ReservationController {
  @Post("")
  async reserveConcert(
    @Body() reserveConcertRequest: ReserveConcertRequest,
  ): Promise<any> {
    return {
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
  }
}
