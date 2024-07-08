import { Test, TestingModule } from "@nestjs/testing";
import { TokenController } from "./token.controller";
import { JwtModule } from "@nestjs/jwt";
import { GetTokenUseCase } from "../../../application/use-case/token/get-token.use-case";
import key from "../../../config/token/key";
import { TokenService } from "../../../domain/service/token/token.service";
import { WaitingQueueRepositorySymbol } from "../../../domain/interface/repository/waiting-queue.repository";
import { UserService } from "../../../domain/service/user/user.service";
import { UserRepositorySymbol } from "../../../domain/interface/repository/user.repository";

describe("AuthController", () => {
  let controller: TokenController;
  let getTokenUseCase: GetTokenUseCase;

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
        TokenService,
        UserService,
        {
          provide: WaitingQueueRepositorySymbol,
          useValue: jest.fn(),
        },
        {
          provide: UserRepositorySymbol,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TokenController>(TokenController);
    getTokenUseCase = module.get(GetTokenUseCase);
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
});
