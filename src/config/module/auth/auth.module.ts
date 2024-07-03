import { Module } from "@nestjs/common";
import { AuthController } from "../../../presentation/auth/auth.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      global: true,
      secret: "11",
      signOptions: { expiresIn: "600s" },
    }),
  ],
})
export class AuthModule {}
