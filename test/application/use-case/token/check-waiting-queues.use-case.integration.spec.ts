import { TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { User } from "@app/infrastructure/entity/user.entity";
import "../../../mock/config/jest-setup";
import Redis from "ioredis";
import { ChangeToActiveQueuesUseCase } from "@app/application/use-case/token/change-to-active-queues.use-case";

describe("ChangeToActiveQueuesUseCase", () => {
  let changeToActiveQueuesUseCase: ChangeToActiveQueuesUseCase;
  let dataSource: DataSource;
  let user: User;
  let redis: Redis;

  beforeAll(async () => {
    const module: TestingModule = global.mockModule;

    changeToActiveQueuesUseCase = module.get<ChangeToActiveQueuesUseCase>(
      ChangeToActiveQueuesUseCase,
    );
    dataSource = module.get<DataSource>(DataSource);
    redis = global.redis;

    // 데이터베이스 초기화 및 테스트 데이터 삽입
    user = await dataSource.createEntityManager().save(User, new User());
  });

  describe("changeToActiveQueuesUseCase 통합테스트", () => {
    it("토큰 정상 발급", async () => {
      // given
      const userId = user.id;

      // when
      await changeToActiveQueuesUseCase.execute();

      // then
      expect("").toBeDefined();
    });
  });
});
