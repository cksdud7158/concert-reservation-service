import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ConcertRepository } from "@app/domain/interface/repository/concert.repository";
import { Concert } from "@app/infrastructure/entity/concert.entity";

@Injectable()
export class ConcertRepositoryImpl implements ConcertRepository {
  constructor(
    @InjectRepository(Concert)
    private readonly concert: Repository<Concert>,
  ) {}

  async selectAll(_manager?: EntityManager): Promise<Concert[]> {
    const manager = _manager ?? this.concert.manager;
    const entity = await manager.find(Concert);

    return entity;
  }

  async findById(
    concertId: number,
    _manager?: EntityManager,
  ): Promise<Concert> {
    const manager = _manager ?? this.concert.manager;
    const entity = await manager.findOne(Concert, {
      where: {
        id: concertId,
      },
    });

    return entity;
  }
}
