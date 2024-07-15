import { Test, TestingModule } from "@nestjs/testing";
import { UserRepositorySymbol } from "@app/domain/interface/repository/user.repository";
import { UserService } from "@app/domain/service/user/user.service";
import { PointHistoryRepositorySymbol } from "@app/domain/interface/repository/point-history.repository";
import { ChargePointUseCase } from "@app/application/use-case/User/charge-point/charge-point.use-case";

describe("ChargePointUseCase", () => {
  let useCase: ChargePointUseCase;
  let userService: UserService;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargePointUseCase,
        UserService,
        {
          provide: UserRepositorySymbol,
          useValue: {
            findOneById: jest.fn(),
            findOnePointById: jest.fn(),
            updatePoint: jest.fn(),
          },
        },
        {
          provide: PointHistoryRepositorySymbol,
          useValue: {
            insert: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<ChargePointUseCase>(ChargePointUseCase);
    userService = module.get<UserService>(UserService);
  });

  describe("포인트 충전 통합테스트", () => {
    const userId = 1;
    it("포인트 충전 완료", async () => {
      // given
      const amount = 1000;

      //when
      jest.spyOn(userService, "chargePoint").mockResolvedValue(amount);
      const res = await useCase.execute(userId, amount);

      //then
      expect(res).toEqual(amount);
    });
  });
});
