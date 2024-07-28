import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "@app/infrastructure/entity/user.entity";
import { mockAppModule } from "../../../mock/App.module";
import { GetPointUseCase } from "@app/application/use-case/user/get-point.use-case";
import "../../../mock/config/jest-setup";

describe("GetPointUseCase", () => {
  let app: INestApplication;
  let getPointUseCase: GetPointUseCase;
  let dataSource: DataSource;
  let user: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...mockAppModule],
    }).compile();

    app = module.createNestApplication();
    getPointUseCase = module.get<GetPointUseCase>(GetPointUseCase);
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

  describe("getPointUseCase 통합테스트", () => {
    it("포인트 정상 조회", async () => {
      // given
      const userId = user.id;

      // when
      const points = await getPointUseCase.execute(userId);

      // then
      expect(points).toBe(2000);
    });

    it("포인트 조회 실패 (없는 유저)", async () => {
      // given
      const userId = 0;

      // when
      const res = getPointUseCase.execute(userId);

      // then
      await expect(res).rejects.toThrow(
        new BadRequestException("없는 유저입니다."),
      );
    });
  });
});
