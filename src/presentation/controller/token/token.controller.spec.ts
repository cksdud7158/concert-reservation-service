import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";
import { WaitingQueueRepositorySymbol } from "@app/domain/interface/repository/waiting-queue.repository";
import { UserRepositorySymbol } from "@app/domain/interface/repository/user.repository";
import { UserService } from "@app/domain/service/user/user.service";
import key from "@app/config/token/key";
import { TokenService } from "@app/domain/service/token/token.service";
import { TokenController } from "@app/presentation/controller/token/token.controller";
import { PointHistoryRepositorySymbol } from "@app/domain/interface/repository/point-history.repository";
import { DataSource, EntityManager } from "typeorm";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token/get-token.use-case";

describe("AuthController", () => {
  let controller: TokenController;
  let getTokenUseCase: GetTokenUseCase;
  let dataSourceMock: Partial<DataSource>;

  beforeEach(async () => {
    dataSourceMock = {
      manager: {} as EntityManager,
      createEntityManager: jest.fn(),
    };

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
        { provide: DataSource, useValue: dataSourceMock },

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
        {
          provide: PointHistoryRepositorySymbol,
          useValue: {
            insert: jest.fn(),
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
