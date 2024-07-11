import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { WaitingQueueRepositorySymbol } from "@app/domain/interface/repository/waiting-queue.repository";
import { TokenService } from "@app/domain/service/token/token.service";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token/get-token.use-case";
import { UserService } from "@app/domain/service/user/user.service";
import { UserRepositorySymbol } from "@app/domain/interface/repository/user.repository";
import { PointHistoryRepositorySymbol } from "@app/domain/interface/repository/point-history.repository";
import { DataSource, EntityManager, QueryRunner } from "typeorm";
import { InternalServerErrorException } from "@nestjs/common";

describe("GetTokenUseCase", () => {
  let useCase: GetTokenUseCase;
  let tokenService: TokenService;
  let userService: UserService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let manager: EntityManager;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        UserService,
        GetTokenUseCase,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              manager: {},
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: UserRepositorySymbol,
          useValue: {
            findOneById: jest.fn(),
            findOnePointById: jest.fn(),
            updatePoint: jest.fn(),
          },
        },
        {
          provide: PointHistoryRepositorySymbol,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: WaitingQueueRepositorySymbol,
          useValue: {
            insert: jest.fn(),
            findByStatusNotExpired: jest.fn(),
            findByIdAndStatus: jest.fn(),
            updateStatusToExpired: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetTokenUseCase>(GetTokenUseCase);
    tokenService = module.get<TokenService>(TokenService);
    userService = module.get<UserService>(UserService);
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
    manager = queryRunner.manager;
  });

  const userId = 1;

  describe("토큰 발급 통합테스트", () => {
    it("토큰 발급 완료", async () => {
      // given
      const token = "test-token";

      //when
      userService.hasUser = jest.fn().mockResolvedValue(true);
      tokenService.getToken = jest.fn().mockResolvedValue(token);

      const result = await useCase.execute(userId);

      //then
      expect(userService.hasUser).toHaveBeenCalledWith(userId);
      expect(tokenService.getToken).toHaveBeenCalledWith(userId, manager);
      expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(result).toBe(token);
    });
    it("getToken 실패 시 롤백 처리해야함 ", async () => {
      const userId = 1;
      const error = new InternalServerErrorException();

      userService.hasUser = jest.fn().mockResolvedValue(true);
      tokenService.getToken = jest.fn().mockRejectedValue(error);

      await expect(useCase.execute(userId)).rejects.toThrow(error);

      expect(userService.hasUser).toHaveBeenCalledWith(userId);
      expect(tokenService.getToken).toHaveBeenCalledWith(userId, manager);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});
