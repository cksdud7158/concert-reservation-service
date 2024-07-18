import { ChargePointUseCase } from "@app/application/use-case/user/charge-point/charge-point.use-case";
import { DataSource } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { PointHistory } from "@app/infrastructure/entity/point-history.entity";
import { User } from "@app/infrastructure/entity/user.entity";
import { BadRequestException, INestApplication } from "@nestjs/common";
import { mockAppModule } from "../../../../mock/App.module";

describe("ChargePointUseCase", () => {
  let app: INestApplication;
  let chargePointUseCase: ChargePointUseCase;
  let dataSource: DataSource;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...mockAppModule],
    }).compile();

    app = module.createNestApplication();
    chargePointUseCase = module.get<ChargePointUseCase>(ChargePointUseCase);
    dataSource = module.get<DataSource>(DataSource);

    await app.init();

    // 데이터베이스 초기화 및 테스트 데이터 삽입
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      user = await queryRunner.manager.save(User, { point: 2000 });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  });

  afterEach(async () => {
    // 데이터 정리
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.clear(PointHistory);
      await queryRunner.manager.clear(User);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    await app.close();
  });

  describe("chargePointUseCase 통합테스트", () => {
    it("포인트 정상 충전", async () => {
      const userId = user.id;
      const chargeAmount = 500;

      const newBalance = await chargePointUseCase.execute(userId, chargeAmount);

      expect(newBalance).toBe(2500);
    });

    it("포인트 충전 실패 (없는 유저)", async () => {
      const userId = 0;
      const chargeAmount = 500;

      const res = chargePointUseCase.execute(userId, chargeAmount);

      await expect(res).rejects.toThrow(
        new BadRequestException("없는 유저입니다."),
      );
    });
  });
});
