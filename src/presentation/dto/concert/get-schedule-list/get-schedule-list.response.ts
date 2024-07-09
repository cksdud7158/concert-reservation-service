import { ApiProperty } from "@nestjs/swagger";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";

const schedulesExample = [
  {
    id: 1,
    date: 12321345,
    isSoldOut: false,
  },
];

export class GetScheduleListResponse {
  @ApiProperty({ example: 10, minimum: 0 })
  total: number;

  @ApiProperty({ example: schedulesExample })
  schedules: {
    id: number;
    date: Date;
  }[];

  static toResponse(
    concertSchedules: Partial<ConcertSchedule>[],
  ): GetScheduleListResponse {
    return {
      total: concertSchedules.length,
      schedules: concertSchedules.map((schedule) => ({
        id: schedule.id,
        date: schedule.date,
      })),
    };
  }
}
