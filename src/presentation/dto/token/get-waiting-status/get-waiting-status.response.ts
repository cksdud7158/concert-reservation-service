import { IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";
import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";

export class GetWaitingStatusResponse {
  @ApiProperty({
    description: "대기 상태",
    example: "AVAILABLE",
    type: "enum",
    enum: WaitingQueueStatus,
  })
  @IsEnum(WaitingQueueStatus)
  status: WaitingQueueStatus;

  @ApiProperty({
    description: "대기 순서",
    example: 0,
    type: Number,
  })
  @IsNumber()
  orderNum: number;

  static toResponse(waitingQueue: WaitingQueue): GetWaitingStatusResponse {
    return {
      status: waitingQueue.status,
      orderNum: waitingQueue.orderNum,
    };
  }
}
