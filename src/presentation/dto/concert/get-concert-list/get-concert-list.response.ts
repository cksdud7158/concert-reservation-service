import { ApiProperty } from "@nestjs/swagger";
import { Concert } from "@app/infrastructure/entity/concert.entity";

const concertsExample = [
  {
    id: 1,
    creat_at: "2024-07-15T11:51:41.844Z",
    update_at: "2024-07-15T11:51:41.844Z",
    name: "콘서트1",
  },
];

export class GetConcertListResponse {
  @ApiProperty({ example: 1, minimum: 0 })
  total: number;

  @ApiProperty({ example: concertsExample })
  concert: {
    id: number;
    creat_at: Date;
    update_at: Date;
    name: string;
  }[];

  static toResponse(concerts: Partial<Concert>[]): GetConcertListResponse {
    return {
      total: concerts.length,
      concert: concerts.map((concert) => ({
        id: concert.id,
        creat_at: concert.creat_at,
        update_at: concert.update_at,
        name: concert.name,
      })),
    };
  }
}
