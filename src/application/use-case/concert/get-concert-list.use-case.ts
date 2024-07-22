import { Inject, Injectable } from "@nestjs/common";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { ConcertEntity } from "@app/domain/entity/concert.entity";

@Injectable()
export class GetConcertListUseCase {
  constructor(@Inject() private readonly concertService: ConcertService) {}

  async execute(): Promise<ConcertEntity[]> {
    return this.concertService.getConcertList();
  }
}
