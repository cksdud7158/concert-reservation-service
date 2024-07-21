import { Test, TestingModule } from "@nestjs/testing";
import { GetPointUseCase } from "@app/application/use-case/user/get-point/get-point.use-case";
import { BadRequestException, INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "@app/infrastructure/entity/user.entity";
import { PointHistory } from "@app/infrastructure/entity/point-history.entity";
import { mockAppModule } from "../../../../mock/App.module";

describe("GetPointUseCase", () => {
  let app: INestApplication;
  let getPointUseCase: GetPointUseCase;
  let dataSource: DataSource;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...mockAppModule],
    }).compile();

    app = module.createNestApplication();
    getPointUseCase = module.get<GetPointUseCase>(GetPointUseCase);
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

  describe("getPointUseCase 통합테스트", () => {
    it("포인트 정상 조회", async () => {
      const userId = user.id;

      const points = await getPointUseCase.execute(userId);

      expect(points).toBe(2000);
    });

    it("포인트 조회 실패 (없는 유저)", async () => {
      const userId = 0;

      const res = getPointUseCase.execute(userId);

      await expect(res).rejects.toThrow(
        new BadRequestException("없는 유저입니다."),
      );
    });
  });
});
