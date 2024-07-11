import { ApiProperty } from "@nestjs/swagger";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";

const schedulesExample = [
  {
    id: 1,
    date: new Date(),
  },
];

export class GetScheduleListResponse {
  @ApiProperty({ example: 1, minimum: 0 })
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
