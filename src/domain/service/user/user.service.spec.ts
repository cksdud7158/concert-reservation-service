import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import {
  UserRepository,
  UserRepositorySymbol,
} from "../../interface/repository/user.repository";
import { User } from "../../../infrastructure/entity/User.entity";

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
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepositorySymbol);
  });

  const userId = 1;

  describe("유저 확인 method(hasUser)", () => {
    it("유저 확인 완료", async () => {
      // given
      const user: User = {
        id: userId,
        creat_at: 0,
        update_at: 0,
        point: 100,
      };

      //when
      jest.spyOn(userRepository, "findOneById").mockResolvedValue(user);

      const res = await service.hasUser(userId);

      //then
      expect(res).toBeTruthy();
    });
    it("유저 없음", async () => {
      // given

      //when
      jest.spyOn(userRepository, "findOneById").mockResolvedValue(null);

      const res = await service.hasUser(userId);

      //then
      expect(res).toBeFalsy();
    });
  });
});
