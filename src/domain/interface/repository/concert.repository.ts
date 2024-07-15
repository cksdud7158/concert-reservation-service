import { EntityManager } from "typeorm";
import { Concert } from "@app/infrastructure/entity/concert.entity";

export const ConcertRepositorySymbol = Symbol.for("ConcertRepository");

export interface ConcertRepository {
  findById(concertId: number, _manager?: EntityManager): Promise<Concert>;
  selectAll(_manager?: EntityManager): Promise<Concert[]>;
}
