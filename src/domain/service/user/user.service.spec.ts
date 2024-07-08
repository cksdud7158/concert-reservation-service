import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import {
  UserRepository,
  UserRepositorySymbol,
} from "../../interface/repository/user.repository";
import { User } from "../../../infrastructure/entity/User.entity";
import { BadRequestException } from "@nestjs/common";

describe("TokenService", () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepositorySymbol,
          useValue: {
            findOneById: jest.fn(),
            findOnePointById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepositorySymbol);
  });

  const userId = 1;
  const user: User = {
    id: userId,
    creat_at: 0,
    update_at: 0,
    point: 100,
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
        .mockResolvedValue(user.point);

      const res = await service.getPoint(userId);

      //then
      expect(res).toBe(user.point);
    });
    it("유저 없음", async () => {
      // given

      //when
      jest.spyOn(userRepository, "findOnePointById").mockResolvedValue(null);

      const res = service.getPoint(userId);

      //then
      await expect(res).rejects.toThrow(BadRequestException);
    });
  });
});
