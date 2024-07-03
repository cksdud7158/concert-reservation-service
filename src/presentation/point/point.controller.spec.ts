import { Test, TestingModule } from "@nestjs/testing";
import { PointController } from "./point.controller";

describe("PointController", () => {
  let controller: PointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointController],
    }).compile();

    controller = module.get<PointController>(PointController);
  });

  describe("/user/{userId}/balance (GET)", () => {
    it("잔액 조회 성공", async () => {
      //given
      const userId = 1;
      const response = {
        balance: 1000,
      };

      //when

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
