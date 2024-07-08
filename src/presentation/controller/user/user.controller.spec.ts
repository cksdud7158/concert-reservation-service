import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { GetPointUseCase } from "../../../application/use-case/User/get-point.use-case";
import { UserService } from "../../../domain/service/user/user.service";
import { UserRepositorySymbol } from "../../../domain/interface/repository/user.repository";

describe("PointController", () => {
  let controller: UserController;
  let getPointUseCase: GetPointUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        GetPointUseCase,
        UserService,
        {
          provide: UserRepositorySymbol,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    getPointUseCase = module.get<GetPointUseCase>(GetPointUseCase);
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

      //then
      const res = await controller.chargePoint(userId, request);

      expect(res).toBeTruthy();
    });
  });
});
