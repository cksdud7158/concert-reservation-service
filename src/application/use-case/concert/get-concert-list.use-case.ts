import { Inject, Injectable } from "@nestjs/common";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { Concert } from "@app/infrastructure/entity/concert.entity";

@Injectable()
export class GetConcertListUseCase {
  constructor(@Inject() private readonly concertService: ConcertService) {}

  async execute(): Promise<Concert[]> {
    return this.concertService.getConcertList();
  }
}
