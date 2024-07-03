import { Body, Controller, Post } from "@nestjs/common";
import { SignInRequest } from "../../application/auth/dto/request/sign-in.request";
import { JwtService } from "@nestjs/jwt";

@Controller("auth")
export class AuthController {
  constructor(private jwtService: JwtService) {}
  @Post("sign-in")
  async signIn(@Body() signInRequest: SignInRequest): Promise<any> {
    const payload = { sub: signInRequest.userId, status: 0 };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
