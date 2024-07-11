import { Test, TestingModule } from "@nestjs/testing";
import {
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  UserRepository,
  UserRepositorySymbol,
} from "@app/domain/interface/repository/user.repository";
import { User } from "@app/infrastructure/entity/user.entity";
import { UserService } from "@app/domain/service/user/user.service";
import PointEntity from "@app/domain/entity/point.entity";

describe("UserService", () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepositorySymbol,
          useValue: {
            findOneById: jest.fn(),
            findOnePointById: jest.fn(),
            updatePoint: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepositorySymbol);
  });

  const userId = 1;
  const amount = 1000;
  const user: User = {
    id: userId,
    creat_at: new Date(),
    update_at: new Date(),
    point: amount,
  };

  describe("유저 확인 method(hasUser)", () => {
    it("유저 확인 완료", async () => {
      // given

      //when
      const findOneById = jest
        .spyOn(userRepository, "findOneById")
        .mockResolvedValue(user);

      await service.hasUser(userId);

      //then
      expect(findOneById).toBeCalled();
    });
    it("유저 없음", async () => {
      // given

      //when
      jest.spyOn(userRepository, "findOneById").mockResolvedValue(null);

      const res = service.hasUser(userId);

      //then
      await expect(res).rejects.toThrow(BadRequestException);
    });
  });
  describe("포인트 조회 method(getPoint)", () => {
    it("포인트 조회 완료", async () => {
      // given

      //when
      jest
        .spyOn(userRepository, "findOnePointById")
        .mockResolvedValue(new PointEntity(amount));

      const res = await service.getPoint(userId);

      //then
      expect(res).toBe(amount);
    });
    it("유저 없음", async () => {
      // given

      //when
      jest.spyOn(userRepository, "findOnePointById").mockResolvedValue(null);

      const res = service.getPoint(userId);

      //then
      await expect(res).rejects.toThrow(TypeError);
    });
  });
  describe("포인트 충전 method(chargePoint)", () => {
    it("포인트 충전 완료", async () => {
      // given

      //when
      jest
        .spyOn(userRepository, "findOnePointById")
        .mockResolvedValue(new PointEntity(amount));
      jest.spyOn(userRepository, "updatePoint");

      const res = await service.chargePoint(userId, amount);

      //then
      expect(res).toBe(amount + amount);
    });
    it("충전 실패", async () => {
      // given

      //when
      jest
        .spyOn(userRepository, "findOnePointById")
        .mockResolvedValue(new PointEntity(amount));
      jest
        .spyOn(userRepository, "updatePoint")
        .mockRejectedValue(new InternalServerErrorException());

      const res = service.chargePoint(userId, amount);

      //then
      await expect(res).rejects.toThrow(InternalServerErrorException);
    });
  });
});
