import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ApiTag } from "../../../config/swagger/api-tag-enum";
import { ChargePointResponse } from "../../dto/user/dto/charge-point/charge-point.response";
import { ChargePointRequest } from "../../dto/user/dto/charge-point/charge-point.request";

@Controller("user")
@ApiTags(ApiTag.User)
export class UserController {
  @Post(":userId/balance")
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
    @Param("userId") userId: number,
  ): Promise<ChargePointResponse> {
    return {
      balance: 1000,
    };
  }

  @Patch(":userId/charge")
  async chargePoint(
    @Param("userId") userId: number,
    @Body() chargePointRequest: ChargePointRequest,
  ): Promise<any> {
    return true;
  }
}
