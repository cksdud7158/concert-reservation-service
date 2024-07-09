import { Test, TestingModule } from "@nestjs/testing";
import { TokenService } from "./token.service";
import { JwtService } from "@nestjs/jwt";
import {
  WaitingQueueRepository,
  WaitingQueueRepositorySymbol,
} from "@app/domain/interface/repository/waiting-queue.repository";
import WaitingQueuesEntity from "@app/domain/entity/waiting-queues.entity";
import WaitingQueueStatus from "@app/infrastructure/enum/waiting-queue-status.enum";

describe("TokenService", () => {
  let service: TokenService;
  let jwtService: JwtService;
  let waitingQueueRepository: jest.Mocked<WaitingQueueRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
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

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    waitingQueueRepository = module.get(WaitingQueueRepositorySymbol);
  });

  const userId = 1;

  describe("토큰 발급 method(getToken)", () => {
    it("토큰 발급 완료", async () => {
      // given
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInN0YXR1cyI6MCwiaWF0IjoxNzIwMzU0NjU1LCJleHAiOjE3MjAzNTgyNTV9.RoRR1NcQ-TWzWXxMXL2_XlWYB1I8LUlE4TR1doeosOM";
      const waitingQueuesEntity = new WaitingQueuesEntity([
        {
          id: 1,
          status: WaitingQueueStatus.AVAILABLE,
          creat_at: 0,
          user_id: userId,
          update_at: 0,
        },
      ]);
      //when
      jest
        .spyOn(waitingQueueRepository, "findByStatusNotExpired")
        .mockResolvedValue(waitingQueuesEntity);
      const signAsync = jest
        .spyOn(jwtService, "signAsync")
        .mockResolvedValue(token);
      const res = await service.getToken(userId);

      //then
      expect(signAsync).toBeCalled();
      expect(res).toBe(token);
    });
  });
});
