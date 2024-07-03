import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        JwtModule.register({
          secret: "11",
          signOptions: { expiresIn: "600s" },
        }),
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe("/auth/sign-in (POST)", () => {
    it("토큰 발급 성공", async () => {
      //given
      const request = {
        userId: 1,
      };
      //when

      //then
      const res = await controller.signIn(request);

      expect(res).toBeTruthy();
    });
  });
});
