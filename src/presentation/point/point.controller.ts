import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { ChargePointRequest } from "../../application/point/dto/request/charge-point.request";

@Controller("user")
export class PointController {
  @Post(":userId/balance")
  async getPoint(@Param("userId") userId: number): Promise<any> {
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
