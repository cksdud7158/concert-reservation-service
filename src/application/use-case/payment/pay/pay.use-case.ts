import { Inject, Injectable } from "@nestjs/common";
import { PaymentService } from "@app/domain/service/payment/payment.service";
import { Payment } from "@app/infrastructure/entity/payment.entity";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { UserService } from "@app/domain/service/user/user.service";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import ConcertScheduleStatus from "@app/infrastructure/enum/concert-seat-status.enum";
import { DataSource } from "typeorm";

@Injectable()
export class PayUseCase {
  constructor(
    @Inject() private readonly paymentService: PaymentService,
    @Inject() private readonly reservationService: ReservationService,
    @Inject() private readonly userService: UserService,
    @Inject() private readonly concertService: ConcertService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    userId: number,
    ticketIds: number[],
  ): Promise<Partial<Payment>> {
    // 티켓 조회
    const ticketList = await this.reservationService.getTicketList(
      userId,
      ticketIds,
    );
    const seatIds = ticketList.map((ticket) => ticket.seat.id);

    // 5분 지났으면 구매 못함
    await this.concertService.checkExpiredTime(seatIds);

    const totalPrice = ticketList.reduce((pv, cv) => pv + cv.seat.price, 0);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    try {
      // 포인트 사용
      await this.userService.usePoint(userId, totalPrice, manager);

      // 좌석 판매 완료로 변경
      await this.concertService.changeStatus(
        seatIds,
        ConcertScheduleStatus.SOLD_OUT,
        manager,
      );

      // 결제
      return await this.paymentService.pay(
        userId,
        ticketIds,
        totalPrice,
        manager,
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
