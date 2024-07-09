import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiTag } from "@app/config/swagger/api-tag-enum";
import { TokenRequest } from "@app/presentation/dto/token/dto/token/token.request";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token.use-case";

@Controller("token")
@ApiTags(ApiTag.Token)
export class TokenController {
  constructor(@Inject() private readonly getTokenUseCase: GetTokenUseCase) {}

  @Post("")
  @ApiOperation({ summary: "토큰 발급 API" })
  @ApiCreatedResponse({
    description: "유저를 생성 완료",
    type: String,
  })
  async getToken(@Body() tokenRequest: TokenRequest): Promise<string> {
    return await this.getTokenUseCase.execute(tokenRequest.userId);
  }
}
