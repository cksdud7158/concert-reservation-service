import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import {
  WaitingQueueRepository,
  WaitingQueueRepositorySymbol,
} from "@app/domain/interface/repository/waiting-queue.repository";
import WaitingQueuesEntity from "@app/domain/entity/waiting-queues.entity";
import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";
import { TokenService } from "@app/domain/service/token/token.service";
import { mockWaitingQueueProvider } from "../../../mock/repositroy-mocking/waiting-queue-repository.mock";
import WaitingQueueEntity from "@app/domain/entity/waiting-queue.entity";

describe("TokenService", () => {
  let service: TokenService;
  let jwtService: JwtService;
  let waitingQueueRepository: jest.Mocked<WaitingQueueRepository>;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        mockWaitingQueueProvider,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
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
      const waitingQueue = new WaitingQueueEntity(
        1,
        new Date(),
        new Date(),
        userId,
        0,
        WaitingQueueStatus.AVAILABLE,
      ) as WaitingQueueEntity;

      const waitingQueuesEntity = new WaitingQueuesEntity([waitingQueue]);
      //when
      jest
        .spyOn(waitingQueueRepository, "findByNotExpiredStatus")
        .mockResolvedValue(waitingQueuesEntity);
      jest
        .spyOn(waitingQueueRepository, "save")
        .mockResolvedValue(waitingQueue);
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
