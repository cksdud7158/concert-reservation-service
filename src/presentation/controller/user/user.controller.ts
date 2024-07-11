import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IdPipe } from "@app/presentation/pipe/id.pipe";
import { ApiTag } from "@app/config/swagger/api-tag-enum";
import { ChargePointUseCase } from "@app/application/use-case/User/charge-point.use-case";
import { GetPointUseCase } from "@app/application/use-case/User/get-point.use-case";

import { ChargePointResponse } from "@app/presentation/dto/user/charge-point/charge-point.response";
import { ChargePointRequest } from "@app/presentation/dto/user/charge-point/charge-point.request";

@Controller("user")
@ApiTags(ApiTag.User)
export class UserController {
  constructor(
    private readonly getPointUseCase: GetPointUseCase,
    private readonly chargePointUseCase: ChargePointUseCase,
  ) {}

  @Get(":userId/balance")
  @ApiOperation({ summary: "포인트 조회 API" })
  async getPoint(
    @Param("userId", IdPipe) userId: number,
  ): Promise<ChargePointResponse> {
    const point = await this.getPointUseCase.execute(userId);
    return ChargePointResponse.toResponse(point);
  }

  @ApiOperation({ summary: "잔액 충전 API" })
  @Patch(":userId/charge")
  async chargePoint(
    @Param("userId", IdPipe) userId: number,
    @Body() chargePointRequest: ChargePointRequest,
  ): Promise<number> {
    return this.chargePointUseCase.execute(userId, chargePointRequest.amount);
  }
}
