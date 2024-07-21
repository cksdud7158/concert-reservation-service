import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "@app/infrastructure/entity/user.entity";
import { PointHistory } from "@app/infrastructure/entity/point-history.entity";
import { TokenService } from "@app/domain/service/token/token.service";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token/get-token.use-case";
import { mockAppModule } from "../../../../mock/App.module";

describe("GetTokenUseCase", () => {
  let app: INestApplication;
  let getTokenUseCase: GetTokenUseCase;
  let dataSource: DataSource;
  let tokenService: TokenService;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...mockAppModule],
    }).compile();

    app = module.createNestApplication();
    getTokenUseCase = module.get<GetTokenUseCase>(GetTokenUseCase);
    dataSource = module.get<DataSource>(DataSource);
    tokenService = module.get<TokenService>(TokenService);

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

  describe("getTokenUseCase 통합테스트", () => {
    it("토큰 정상 발급", async () => {
      const userId = user.id;
      const token = "sample-token";

      jest.spyOn(tokenService, "getToken").mockResolvedValue(token);

      const result = await getTokenUseCase.execute(userId);

      expect(result).toBe(token);
    });

    it("토큰 발급 실패 (없는 유저)", async () => {
      const userId = 0;

      const res = getTokenUseCase.execute(userId);

      await expect(res).rejects.toThrow(
        new BadRequestException("없는 유저입니다."),
      );
    });
  });
});
