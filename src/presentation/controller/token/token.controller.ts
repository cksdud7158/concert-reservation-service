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
import { GetWaitingStatusResponse } from "@app/presentation/dto/token/get-waiting-status/get-waiting-status.response";
import { TokenGuard } from "@app/presentation/guard/token.guard";
import { GetWaitingStatusUseCase } from "@app/application/use-case/token/get-waiting-status.use-case";
import { GetTokenUseCase } from "@app/application/use-case/token/get-token.use-case";

@Controller("token")
@ApiTags(ApiTag.Token)
export class TokenController {
  constructor(
    @Inject() private readonly getTokenUseCase: GetTokenUseCase,
    @Inject() private readonly getWaitingStatusUseCase: GetWaitingStatusUseCase,
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

  @Get("waiting-status")
  @ApiOperation({ summary: "대기 상태 조회 API" })
  @UseGuards(TokenGuard)
  async getWaitingStatus(@Request() req): Promise<GetWaitingStatusResponse> {
    const id = req.id;
    return GetWaitingStatusResponse.toResponse(
      await this.getWaitingStatusUseCase.execute(id),
    );
  }
}
