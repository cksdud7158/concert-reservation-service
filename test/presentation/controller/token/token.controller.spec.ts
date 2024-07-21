import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "@app/domain/service/user/user.service";
import key from "@app/config/token/key";
import { TokenService } from "@app/domain/service/token/token.service";
import { TokenController } from "@app/presentation/controller/token/token.controller";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token/get-token.use-case";
import { mockWaitingQueueProvider } from "../../../mock/repositroy-mocking/waiting-queue-repository.mock";
import { mockUserProvider } from "../../../mock/repositroy-mocking/user-repository.mock";
import { mockPointHistoryProvider } from "../../../mock/repositroy-mocking/point-history-repository.mock";
import { datasourceProvider } from "../../../mock/lib/datasource.mock";
import { GetWaitingStatusUseCase } from "@app/application/use-case/token/get-waiting-status/get-waiting-status.use-case";
import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";
import WaitingQueueStatus from "@app/infrastructure/enum/waiting-queue-status.enum";
import { GetWaitingStatusResponse } from "@app/presentation/dto/token/get-waiting-status/get-waiting-status.response";

describe("AuthController", () => {
  let controller: TokenController;
  let getTokenUseCase: GetTokenUseCase;
  let getWaitingStatusUseCase: GetWaitingStatusUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      imports: [
        JwtModule.register({
          secret: key,
          signOptions: { expiresIn: "1h" },
        }),
      ],
      providers: [
        GetTokenUseCase,
        GetWaitingStatusUseCase,
        TokenService,
        UserService,
        datasourceProvider,
        mockWaitingQueueProvider,
        mockUserProvider,
        mockPointHistoryProvider,
      ],
    }).compile();

    controller = module.get<TokenController>(TokenController);
    getTokenUseCase = module.get(GetTokenUseCase);
    getWaitingStatusUseCase = module.get(GetWaitingStatusUseCase);
  });

  describe("/token (POST)", () => {
    it("토큰 발급 성공", async () => {
      //given
      const request = {
        userId: 1,
      };
      const response =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInN0YXR1cyI6MCwiaWF0IjoxNzIwMzU0NjU1LCJleHAiOjE3MjAzNTgyNTV9.RoRR1NcQ-TWzWXxMXL2_XlWYB1I8LUlE4TR1doeosOM";
      //when
      jest.spyOn(getTokenUseCase, "execute").mockResolvedValue(response);
      //then
      const res = await controller.getToken(request);

      expect(res).toBe(response);
    });
  });
  describe("/token/waiting-status (GET)", () => {
    it("상태 조회 성공", async () => {
      const req = { id: 1 };
      const waitingQueue = {
        id: 1,
        status: WaitingQueueStatus.AVAILABLE,
        orderNum: 0,
        user_id: 1,
      } as WaitingQueue;

      jest
        .spyOn(getWaitingStatusUseCase, "execute")
        .mockResolvedValue(waitingQueue);

      const res = await controller.getWaitingStatus(req);

      expect(res).toEqual(GetWaitingStatusResponse.toResponse(waitingQueue));
      expect(getWaitingStatusUseCase.execute).toHaveBeenCalledWith(req.id);
    });
  });
});
