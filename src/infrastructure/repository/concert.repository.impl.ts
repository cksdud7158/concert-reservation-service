import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ConcertRepository } from "@app/domain/interface/repository/concert.repository";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertEntity } from "@app/domain/entity/concert/concert.entity";
import ConcertMapper from "@app/infrastructure/mapper/concert.mapper";

@Injectable()
export class ConcertRepositoryImpl implements ConcertRepository {
  constructor(
    @InjectRepository(Concert)
    private readonly concert: Repository<Concert>,
  ) {}

  async selectAll(_manager?: EntityManager): Promise<ConcertEntity[]> {
    const manager = _manager ?? this.concert.manager;
    const entities = await manager
      .createQueryBuilder()
      .select()
      .from(Concert, "concert")
      .limit(20)
      .execute();

    return entities.map((concert) => ConcertMapper.toDomain(concert));
  }

  async save(concert: ConcertEntity[]): Promise<void> {
    await this.concert.save(concert);
  }
}
