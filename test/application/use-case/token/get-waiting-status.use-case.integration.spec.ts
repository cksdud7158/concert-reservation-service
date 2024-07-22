import { TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { User } from "@app/infrastructure/entity/user.entity";
import { JwtService } from "@nestjs/jwt";
import { PayloadType } from "@app/domain/type/token/payload.type";
import key from "@app/config/token/key";
import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";
import { GetWaitingStatusUseCase } from "@app/application/use-case/token/get-waiting-status.use-case";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token.use-case";

describe("GetWaitingStatusUseCase", () => {
  let getWaitingStatusUseCase: GetWaitingStatusUseCase;
  let getTokenUseCase: GetTokenUseCase;
  let dataSource: DataSource;
  let jwtService: JwtService;
  let user: User;

  beforeAll(async () => {
    const module: TestingModule = global.mockModule;

    getWaitingStatusUseCase = module.get<GetWaitingStatusUseCase>(
      GetWaitingStatusUseCase,
    );
    getTokenUseCase = module.get<GetTokenUseCase>(GetTokenUseCase);
    dataSource = module.get<DataSource>(DataSource);
    jwtService = module.get(JwtService);

    // 데이터베이스 초기화 및 테스트 데이터 삽입
    user = await dataSource.createEntityManager().save(User, { point: 2000 });
  });

  describe("GetWaitingStatusUseCase 통합테스트", () => {
    it("현재 상태 조회 완료", async () => {
      // given
      const token = await getTokenUseCase.execute(user.id);
      const payload: PayloadType = await jwtService.verifyAsync(token, {
        secret: key,
      });

      // when
      const res = await getWaitingStatusUseCase.execute(payload.sub);

      // then
      expect(res.user_id).toBe(user.id);
      expect(res.status).toBe(WaitingQueueStatus.AVAILABLE);
      expect(res.orderNum).toBe(0);
    });
  });
});
