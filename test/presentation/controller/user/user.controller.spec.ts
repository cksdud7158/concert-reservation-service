import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "@app/domain/service/user/user.service";
import { UserController } from "@app/presentation/controller/user/user.controller";
import { mockUserProvider } from "../../../mock/repositroy-mocking/user-repository.mock";
import { mockPointHistoryProvider } from "../../../mock/repositroy-mocking/point-history-repository.mock";
import { ChargePointUseCase } from "@app/application/use-case/user/charge-point.use-case";
import { GetPointUseCase } from "@app/application/use-case/user/get-point.use-case";

describe("UserController", () => {
  let controller: UserController;
  let getPointUseCase: GetPointUseCase;
  let chargePointUseCase: ChargePointUseCase;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        GetPointUseCase,
        ChargePointUseCase,
        UserService,
        mockUserProvider,
        mockPointHistoryProvider,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    getPointUseCase = module.get<GetPointUseCase>(GetPointUseCase);
    chargePointUseCase = module.get<ChargePointUseCase>(ChargePointUseCase);
  });

  describe("/user/{userId}/balance (GET)", () => {
    it("잔액 조회 성공", async () => {
      //given
      const userId = 1;
      const response = {
        balance: 1000,
      };

      //when
      jest.spyOn(getPointUseCase, "execute").mockResolvedValue(1000);

      //then
      const res = await controller.getPoint(userId);

      expect(res).toEqual(response);
    });
  });

  describe("/user/{userId}/charge (PATCH)", () => {
    it("잔액 충전 성공", async () => {
      //given
      const userId = 1;
      const request = {
        amount: 100,
      };

      //when
      jest.spyOn(chargePointUseCase, "execute").mockResolvedValue(1000);

      //then
      const res = await controller.chargePoint(userId, request);

      expect(res).toBeTruthy();
    });
  });
});
