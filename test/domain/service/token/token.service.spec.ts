import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import WaitingQueueStatus from "@app/domain/enum/entity/waiting-queue-status.enum";
import { TokenService } from "@app/domain/service/token/token.service";
import WaitingQueueEntity from "@app/domain/entity/waitingQueue/waiting-queue.entity";
import { BadRequestException } from "@nestjs/common";
import { PayloadType } from "@app/domain/type/token/payload.type";
import { RedisClientSymbol } from "@app/module/provider/redis/redis.provider";
import Redis from "ioredis";
import waitingQueueProvider from "@app/module/provider/repository/waiting-queue.provider";
import { mockRedisProvider } from "../../../mock/lib/redis.mock";

describe("TokenService", () => {
  let service: TokenService;
  let jwtService: JwtService;
  let redis: Redis;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

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
        waitingQueueProvider,
        mockRedisProvider,
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    redis = module.get<Redis>(RedisClientSymbol);
  });

  const userId = 1;

  describe("토큰 발급 method(getToken)", () => {
    it("토큰 발급 완료", async () => {
      // given
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInN0YXR1cyI6MCwiaWF0IjoxNzIwMzU0NjU1LCJleHAiOjE3MjAzNTgyNTV9.RoRR1NcQ-TWzWXxMXL2_XlWYB1I8LUlE4TR1doeosOM";
      const waitingQueue = new WaitingQueueEntity({
        userId: userId,
        orderNum: 0,
        status: WaitingQueueStatus.AVAILABLE,
      }) as WaitingQueueEntity;

      //when
      const signAsync = jest
        .spyOn(jwtService, "signAsync")
        .mockResolvedValue(token);
      const res = await service.getToken(userId);

      //then
      expect(signAsync).toBeCalled();
      expect(res).toBe(token);
    });
  });

  describe("이용 가능 여부 확인 (isAvailable)", () => {
    it("PENDING 상태면 에러 ", async () => {
      const payload = {
        userId: 1,
        orderNum: 1,
        status: WaitingQueueStatus.PENDING,
      } as PayloadType;

      await expect(service.isAvailable(payload)).rejects.toThrow(
        new BadRequestException(`대기번호 ${payload.orderNum}번 입니다.`),
      );
    });

    it("토큰 만료시 에러", async () => {
      const payload = {
        userId: 1,
        orderNum: 1,
        status: WaitingQueueStatus.EXPIRED,
      } as PayloadType;

      await expect(service.isAvailable(payload)).rejects.toThrow(
        new BadRequestException("만료된 토큰입니다."),
      );
    });

    it("Active Tokens 에 없다면 에러", async () => {
      const payload = {
        userId: 1,
        orderNum: 1,
        status: WaitingQueueStatus.AVAILABLE,
      } as PayloadType;

      jest.spyOn(redis, "smembers").mockResolvedValue([]);

      await expect(service.isAvailable(payload)).rejects.toThrow(
        new BadRequestException("만료된 토큰입니다."),
      );
    });
  });
});
