import { Test, TestingModule } from "@nestjs/testing";
import { TokenController } from "./token.controller";
import { JwtModule } from "@nestjs/jwt";

describe("AuthController", () => {
  let controller: TokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      imports: [
        JwtModule.register({
          secret: "11",
          signOptions: { expiresIn: "600s" },
        }),
      ],
    }).compile();

    controller = module.get<TokenController>(TokenController);
  });

  describe("/token/sign-in (POST)", () => {
    it("토큰 발급 성공", async () => {
      //given
      const request = {
        userId: 1,
      };
      //when

      //then
      const res = await controller.token(request);

      expect(res).toBeTruthy();
    });
  });
});
