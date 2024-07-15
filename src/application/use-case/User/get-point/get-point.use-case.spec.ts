import { Test, TestingModule } from "@nestjs/testing";
import { UserRepositorySymbol } from "@app/domain/interface/repository/user.repository";
import { UserService } from "@app/domain/service/user/user.service";
import { PointHistoryRepositorySymbol } from "@app/domain/interface/repository/point-history.repository";
import { GetPointUseCase } from "@app/application/use-case/User/get-point/get-point.use-case";

describe("GetPointUseCase", () => {
  let useCase: GetPointUseCase;
  let userService: UserService;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPointUseCase,
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

    useCase = module.get<GetPointUseCase>(GetPointUseCase);
    userService = module.get<UserService>(UserService);
  });

  describe("포인트 조회 통합테스트", () => {
    const userId = 1;
    it("포인트 조회 완료", async () => {
      // given
      const response = 1000;

      //when
      jest.spyOn(userService, "getPoint").mockResolvedValue(response);
      const res = await useCase.execute(userId);

      //then
      expect(res).toEqual(response);
    });
  });
});
