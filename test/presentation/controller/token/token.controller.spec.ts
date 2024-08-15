import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "@app/domain/service/user/user.service";
import key from "@app/config/token/key";
import { TokenService } from "@app/domain/service/token/token.service";
import { TokenController } from "@app/presentation/controller/token/token.controller";
import { mockUserProvider } from "../../../mock/repositroy-mocking/user-repository.mock";
import { mockPointHistoryProvider } from "../../../mock/repositroy-mocking/point-history-repository.mock";
import { datasourceProvider } from "../../../mock/lib/datasource.mock";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token.use-case";
import { RefreshTokenUseCase } from "@app/application/use-case/token/refresh-token.use-case";
import { mockWaitingQueueProvider } from "../../../mock/repositroy-mocking/waiting-queue-repository.mock";

describe("AuthController", () => {
  let controller: TokenController;
  let getTokenUseCase: GetTokenUseCase;
  let refreshTokenUseCase: RefreshTokenUseCase;

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
        RefreshTokenUseCase,
        TokenService,
        UserService,
        datasourceProvider,
        mockUserProvider,
        mockPointHistoryProvider,
        mockWaitingQueueProvider,
      ],
    }).compile();

    controller = module.get<TokenController>(TokenController);
    getTokenUseCase = module.get(GetTokenUseCase);
    refreshTokenUseCase = module.get(RefreshTokenUseCase);
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
  describe("/token/refresh (GET)", () => {
    it("토큰 리프레쉬 성공", async () => {
      const req = { user: { sub: 1 } };

      const execute = jest.spyOn(refreshTokenUseCase, "execute");

      const res = await controller.refreshToken(req);

      expect(execute).toBeCalled();
    });
  });
});
