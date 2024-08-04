import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiTag } from "@app/config/swagger/api-tag-enum";
import { TokenRequest } from "@app/presentation/dto/token/get-token/token.request";
import { TokenGuard } from "@app/presentation/guard/token.guard";
import { RefreshTokenUseCase } from "@app/application/use-case/token/refresh-token.use-case";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token.use-case";
import { RefreshTokenGuard } from "@app/presentation/guard/refresh-token.guard";

@Controller("token")
@ApiTags(ApiTag.Token)
export class TokenController {
  constructor(
    @Inject() private readonly getTokenUseCase: GetTokenUseCase,
    @Inject() private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post("")
  @ApiOperation({ summary: "토큰 발급 API" })
  @ApiCreatedResponse({
    description: "토큰 생성 완료",
    type: String,
  })
  async getToken(@Body() tokenRequest: TokenRequest): Promise<string> {
    return await this.getTokenUseCase.execute(tokenRequest.userId);
  }

  @Get("refresh")
  @ApiOperation({ summary: "토큰 리프레쉬 API" })
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Request() req): Promise<string> {
    const user = req.user;
    return await this.refreshTokenUseCase.execute(user);
  }
}
