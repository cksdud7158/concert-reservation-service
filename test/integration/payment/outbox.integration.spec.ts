import "../../mock/config/jest-setup";
import { TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { User } from "@app/infrastructure/entity/user.entity";
import { ReserveConcertUseCase } from "@app/application/use-case/reservation/reserve-concert.use-case";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import ConcertScheduleStatus from "@app/domain/enum/entity/concert-seat-status.enum";
import { PayUseCase } from "@app/application/use-case/payment/pay.use-case";
import { TicketEntity } from "@app/domain/entity/ticket/ticket.entity";
import {
  PaymentProducer,
  PaymentProducerSymbol,
} from "@app/domain/interface/message/payment/payment.producer";
import { PaymentPaidConsumer } from "@app/presentation/consumer/payment/payment.paid.consumer";
import { PaidEventService } from "@app/domain/service/payment/paid-event.service";
import { EventBus } from "@nestjs/cqrs";
import { PaidEventListener } from "@app/presentation/event/payment/paid-event-listener/paid-event.listener";
import { TestConsumer } from "@app/presentation/consumer/test/test.consumer";
import { TokenExpireConsumer } from "@app/presentation/consumer/payment/token-expire.consumer";
import { InternalServerErrorException } from "@nestjs/common";
import { PaidEventScheduler } from "@app/presentation/schedule/payment/paid-event.scheduler";
import { SendMessageUseCase } from "@app/application/use-case/payment/send-message.use-case";
import { PaidEvent } from "@app/infrastructure/entity/paid-event.entity";
import { PaidEventEntity } from "@app/domain/entity/payment/paid-event.entity";
import PaidEventStatusEnum from "@app/domain/enum/entity/paid-event-status.enum";
import PaidEventMapper from "@app/infrastructure/mapper/paid-event.mapper";
import { SchedulerRegistry } from "@nestjs/schedule";

describe("아웃 박스 패턴 통합 테스트", () => {
  let payUseCase: PayUseCase;
  let reserveConcertUseCase: ReserveConcertUseCase;
  let dataSource: DataSource;
  let user: User;
  let concert: Concert;
  let schedule: ConcertSchedule;
  let seat1: ConcertSeat;
  let seat2: ConcertSeat;
  let ticketEntities: TicketEntity[];
  let paymentProducer: PaymentProducer;
  let paymentPaidConsumer: PaymentPaidConsumer;
  let testConsumer: TestConsumer;
  let tokenExpireConsumer: TokenExpireConsumer;
  let paidEventService: PaidEventService;
  let eventBus: EventBus;
  let paidEventListener: PaidEventListener;
  let paidEventScheduler: PaidEventScheduler;
  let sendMessageUseCase: SendMessageUseCase;
  let schedulerRegistry: SchedulerRegistry;

  beforeEach(async () => {
    const module: TestingModule = global.mockModule;

    payUseCase = module.get<PayUseCase>(PayUseCase);
    reserveConcertUseCase = module.get<ReserveConcertUseCase>(
      ReserveConcertUseCase,
    );
    dataSource = module.get<DataSource>(DataSource);
    paymentProducer = module.get<PaymentProducer>(PaymentProducerSymbol);
    paymentPaidConsumer = module.get<PaymentPaidConsumer>(PaymentPaidConsumer);
    tokenExpireConsumer = module.get<TokenExpireConsumer>(TokenExpireConsumer);
    testConsumer = module.get<TestConsumer>(TestConsumer);
    paidEventService = module.get<PaidEventService>(PaidEventService);
    eventBus = module.get<EventBus>(EventBus);
    paidEventListener = module.get<PaidEventListener>(PaidEventListener);
    paidEventScheduler = module.get<PaidEventScheduler>(PaidEventScheduler);
    sendMessageUseCase = module.get<SendMessageUseCase>(SendMessageUseCase);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);

    // 데이터베이스 초기화 및 테스트 데이터 삽입
    try {
      await dataSource.createEntityManager().transaction(async (manager) => {
        user = await manager.save(User, { point: 2000 });

        concert = await manager.save(Concert, {
          name: "Test Concert",
        });

        schedule = await manager.save(ConcertSchedule, {
          date: new Date(),
          concert: concert,
        });

        seat1 = await manager.save(ConcertSeat, {
          schedule: schedule,
          status: ConcertScheduleStatus.SALE,
          price: 1000,
          seat_number: 1,
        });
        seat2 = await manager.save(ConcertSeat, {
          schedule: schedule,
          status: ConcertScheduleStatus.SALE,
          price: 1000,
          seat_number: 2,
        });

        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60000);

        await manager.save(
          PaidEvent,
          PaidEventMapper.toEntity(
            new PaidEventEntity({
              payment_id: 1,
              status: PaidEventStatusEnum.INIT,
              message: {
                value: JSON.stringify({
                  id: 36,
                  creat_at: "2024-08-15T13:48:41.466Z",
                  update_at: "2024-08-15T13:48:41.466Z",
                  price: 1341,
                  status: "PAID",
                  user: {
                    id: 1,
                    creat_at: "2024-07-22T23:21:31.943Z",
                    update_at: "2024-08-15T13:48:41.466Z",
                    point: 9963760,
                  },
                }),
              },
              update_at: tenMinutesAgo,
            }),
          ),
        );
      });

      ticketEntities = await reserveConcertUseCase.execute(
        user.id,
        concert.id,
        schedule.id,
        [seat1.id, seat2.id],
      );
    } catch (e) {
      console.log("error::", e);
    }
  });

  afterEach(async () => {
    await paymentPaidConsumer.disconnectConsumer();
    await testConsumer.disconnectConsumer();
    await tokenExpireConsumer.disconnectConsumer();
  });

  it("아웃 박스 패턴 정상 작동", async () => {
    // given
    const ticketIdList = ticketEntities.map((ticketEntity) => ticketEntity.id);
    const save = jest.spyOn(paidEventService, "save");
    const publish = jest.spyOn(eventBus, "publish");
    const handle = jest.spyOn(paidEventListener, "handle");
    const sendMessage = jest.spyOn(paymentProducer, "sendMessage");
    const paymentPaidConsumerHandleMessage = jest.spyOn(
      paymentPaidConsumer,
      "handleMessage",
    );
    const tokenExpireConsumerHandleMessage = jest.spyOn(
      tokenExpireConsumer,
      "handleMessage",
    );

    // when
    await payUseCase.execute(user.id, ticketIdList);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // then
    expect(save).toBeCalled();
    expect(publish).toBeCalled();
    expect(handle).toBeCalled();
    expect(sendMessage).toBeCalled();
    expect(paymentPaidConsumerHandleMessage).toBeCalled();
    expect(tokenExpireConsumerHandleMessage).toBeCalled();
  });
  it("카프카 메시지 발행 실패", async () => {
    // given
    const ticketIdList = ticketEntities.map((ticketEntity) => ticketEntity.id);
    const save = jest.spyOn(paidEventService, "save");
    const publish = jest.spyOn(eventBus, "publish");
    const handle = jest.spyOn(paidEventListener, "handle");
    const handleError = jest.spyOn(paidEventListener, "handleError");
    const sendMessage = jest
      .spyOn(paymentProducer, "sendMessage")
      .mockRejectedValue(new InternalServerErrorException());
    const paymentPaidConsumerHandleMessage = jest.spyOn(
      paymentPaidConsumer,
      "handleMessage",
    );
    const tokenExpireConsumerHandleMessage = jest.spyOn(
      tokenExpireConsumer,
      "handleMessage",
    );

    // when
    await payUseCase.execute(user.id, ticketIdList);

    // then
    expect(save).toBeCalled();
    expect(publish).toBeCalled();
    expect(handle).toBeCalled();
    expect(sendMessage).toBeCalled();
    // 에러 핸들링 메서드 호출
    expect(handleError).toBeCalled();
    expect(paymentPaidConsumerHandleMessage).toBeCalledTimes(0);
    expect(tokenExpireConsumerHandleMessage).toBeCalledTimes(0);
  });
  it("스케쥴 정상 작동", async () => {
    // given
    const cronJob = schedulerRegistry.getCronJob("sendMessage");

    // when
    const execute = jest.spyOn(sendMessageUseCase, "execute");
    const sendMessageNotSuccessStatus = jest.spyOn(
      paidEventService,
      "sendMessageNotSuccessStatus",
    );
    const sendMessage = jest.spyOn(paymentProducer, "sendMessage");

    cronJob.fireOnTick(); // Cron 작업 수동 실행
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // then
    expect(cronJob).toBeDefined();
    expect(execute).toBeCalled();
    expect(sendMessageNotSuccessStatus).toBeCalled();
    expect(sendMessage).toBeCalled();
  });
});
