import { TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "@app/infrastructure/entity/user.entity";
import { JwtService } from "@nestjs/jwt";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token.use-case";
import "../../../mock/config/jest-setup";
import Redis from "ioredis";

describe("GetTokenUseCase", () => {
  let getTokenUseCase: GetTokenUseCase;
  let dataSource: DataSource;
  let jwtService: JwtService;
  let user: User;
  let redis: Redis;

  beforeAll(async () => {
    const module: TestingModule = global.mockModule;

    getTokenUseCase = module.get<GetTokenUseCase>(GetTokenUseCase);
    dataSource = module.get<DataSource>(DataSource);
    jwtService = module.get<JwtService>(JwtService);
    redis = global.redis;

    // 데이터베이스 초기화 및 테스트 데이터 삽입
    user = await dataSource.createEntityManager().save(User, new User());
  });

  describe("getTokenUseCase 통합테스트", () => {
    it("토큰 정상 발급", async () => {
      // given
      const userId = user.id;

      // when
      const res = await getTokenUseCase.execute(userId);

      // then
      expect(res).toBeDefined();
      expect(typeof res).toBe("string");
    });

    it("토큰 발급 실패 (없는 유저)", async () => {
      const res = getTokenUseCase.execute(0);

      await expect(res).rejects.toThrow(
        new BadRequestException("없는 유저입니다."),
      );
    });
  });
});
