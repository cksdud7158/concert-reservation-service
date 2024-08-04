import { DataSource } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "@app/infrastructure/entity/user.entity";
import { BadRequestException, INestApplication } from "@nestjs/common";
import { mockAppModule } from "../../../mock/App.module";
import { ChargePointUseCase } from "@app/application/use-case/user/charge-point.use-case";
import "../../../mock/config/jest-setup";

describe("ChargePointUseCase", () => {
  let app: INestApplication;
  let chargePointUseCase: ChargePointUseCase;
  let dataSource: DataSource;
  let user: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...mockAppModule],
    }).compile();

    app = module.createNestApplication();
    chargePointUseCase = module.get<ChargePointUseCase>(ChargePointUseCase);
    dataSource = module.get<DataSource>(DataSource);

    await app.init();

    // 데이터베이스 초기화 및 테스트 데이터 삽입
    user = await dataSource.createEntityManager().save(User, { point: 2000 });
  });

  afterAll(async () => {
    // 데이터 정리
    await dataSource.dropDatabase();
    await app.close();
  });

  describe("chargePointUseCase 통합테스트", () => {
    it("포인트 정상 충전", async () => {
      // given
      const userId = user.id;
      const chargeAmount = 500;

      // when
      const newBalance = await chargePointUseCase.execute(userId, chargeAmount);

      // then
      expect(newBalance).toBe(2500);
    });

    it("포인트 충전 실패 (없는 유저)", async () => {
      // given
      const userId = 0;
      const chargeAmount = 500;

      // when
      const res = chargePointUseCase.execute(userId, chargeAmount);

      // then
      await expect(res).rejects.toThrow(
        new BadRequestException("없는 유저입니다."),
      );
    });
  });
});
