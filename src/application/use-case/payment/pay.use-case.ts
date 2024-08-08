import { Inject, Injectable } from "@nestjs/common";
import { PaymentService } from "@app/domain/service/payment/payment.service";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { UserService } from "@app/domain/service/user/user.service";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { DataSource } from "typeorm";
import { PaymentEntity } from "@app/domain/entity/payment.entity";
import TicketStatus from "@app/domain/enum/ticket-status.enum";
import ConcertScheduleStatus from "@app/domain/enum/concert-seat-status.enum";
import { EventBus } from "@nestjs/cqrs";
import { PayCompletedEvent } from "@app/application/event/pay-completed.event";

@Injectable()
export class PayUseCase {
  constructor(
    @Inject() private readonly paymentService: PaymentService,
    @Inject() private readonly reservationService: ReservationService,
    @Inject() private readonly userService: UserService,
    @Inject() private readonly concertService: ConcertService,
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}

  async execute(userId: number, ticketIds: number[]): Promise<PaymentEntity> {
    const payment = await this.dataSource
      .createEntityManager()
      .transaction(async (manager) => {
        // PENDING 상태 티켓 조회
        const ticketList = await this.reservationService.getTicketList(
          userId,
          ticketIds,
          manager,
        );

        // ticket AVAILABLE 로 변경
        await this.reservationService.changeStatus(
          ticketList,
          TicketStatus.AVAILABLE,
          manager,
        );

        const seatIds = ticketList.map((ticket) => ticket.seat.id);

        // 5분 지났으면 구매 못함
        await this.concertService.checkExpiredTime(seatIds, manager);

        const totalPrice = ticketList.reduce((pv, cv) => pv + cv.seat.price, 0);

        await this.userService.usePoint(userId, totalPrice, manager);

        const seatList = ticketList.map((ticket) => ticket.seat);

        // 좌석 판매 완료로 변경
        await this.concertService.changeSeatStatus(
          seatList,
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
      });
    // 결제 완료 이벤트 발행
    this.eventBus.publish(new PayCompletedEvent(payment));

    return payment;
  }
}
