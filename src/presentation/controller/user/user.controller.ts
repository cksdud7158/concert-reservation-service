import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ApiTag } from "../../../config/swagger/api-tag-enum";
import { ChargePointResponse } from "../../dto/user/dto/charge-point/charge-point.response";
import { ChargePointRequest } from "../../dto/user/dto/charge-point/charge-point.request";
import { GetPointUseCase } from "../../../application/use-case/User/get-point.use-case";
import { IdPipe } from "../../pipe/id.pipe";

@Controller("user")
@ApiTags(ApiTag.User)
export class UserController {
  constructor(private readonly getPointUseCase: GetPointUseCase) {}

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
    @Param("userId") userId: number,
    @Body() chargePointRequest: ChargePointRequest,
  ): Promise<any> {
    return true;
  }
}
