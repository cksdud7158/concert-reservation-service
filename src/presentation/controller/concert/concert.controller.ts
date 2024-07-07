import { Controller, Get, Param } from "@nestjs/common";

@Controller("concert")
export class ConcertController {
  @Get(":concertId/dates")
  async getDateList(@Param("concertId") concertId: number): Promise<any> {
    return {
      total: 1,
      dates: [
        {
          concertDateId: 1,
          date: 0,
          isSoldOut: false,
        },
      ],
    };
  }

  @Get("/concerts/:concertId/dates/:concertDateId/seats")
  async getSeatList(
    @Param("concertId") concertId: number,
    @Param("concertDateId") concertDateId: number,
  ): Promise<any> {
    return {
      seats: [
        {
          seatId: 1,
          seatNum: 1,
          isReserved: false,
        },
      ],
    };
  }
}
