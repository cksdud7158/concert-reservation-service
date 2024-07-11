import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TokenController } from "../../presentation/controller/token/token.controller";
import key from "../../config/token/key";

@Module({
  controllers: [TokenController],
  imports: [
    JwtModule.register({
      global: true,
      secret: key,
      signOptions: { expiresIn: "1h" },
    }),
  ],
})
export class AuthModule {}
