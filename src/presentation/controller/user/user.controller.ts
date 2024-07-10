import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { IdPipe } from "@app/presentation/pipe/id.pipe";
import { ApiTag } from "@app/config/swagger/api-tag-enum";
import { ChargePointUseCase } from "@app/application/use-case/User/charge-point.use-case";
import { GetPointUseCase } from "@app/application/use-case/User/get-point.use-case";
import { ChargePointRequest } from "@app/presentation/dto/user/dto/charge-point/charge-point.request";
import { ChargePointResponse } from "@app/presentation/dto/user/charge-point/charge-point.response";

@Controller("user")
@ApiTags(ApiTag.User)
export class UserController {
  constructor(
    private readonly getPointUseCase: GetPointUseCase,
    private readonly chargePointUseCase: ChargePointUseCase,
  ) {}

  @Get(":userId/balance")
  @ApiOperation({ summary: "포인트 조회 API" })
  @ApiCreatedResponse({
    description: "포인트 조회 완료",
    type: ChargePointResponse,
  })
  @ApiBadRequestResponse({
    description: "잘못된 요청",
    example: "잘못된 요청입니다.",
  })
  async getPoint(
    @Param("userId", IdPipe) userId: number,
  ): Promise<ChargePointResponse> {
    const point = await this.getPointUseCase.execute(userId);
    return ChargePointResponse.toResponse(point);
  }

  @Patch(":userId/charge")
  async chargePoint(
    @Param("userId", IdPipe) userId: number,
    @Body() chargePointRequest: ChargePointRequest,
  ): Promise<any> {
    return this.chargePointUseCase.execute(userId, chargePointRequest.amount);
  }
}
