import { Body, Controller, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiTag } from "../../../config/swagger/api-tag-enum";
import { TokenRequest } from "../../dto/token/dto/token/token.request";

@Controller("token")
@ApiTags(ApiTag.Token)
export class TokenController {
  constructor(private jwtService: JwtService) {}

  @Post("")
  @ApiOperation({ summary: "토큰 발급 API" })
  @ApiCreatedResponse({
    description: "유저를 생성 완료",
    type: String,
  })
  async token(@Body() tokenRequest: TokenRequest): Promise<string> {
    const payload = { sub: tokenRequest.userId, status: 0 };
    return await this.jwtService.signAsync(payload);
  }
}
