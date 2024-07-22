import { EntityManager } from "typeorm";
import { ConcertEntity } from "@app/domain/entity/concert.entity";

export const ConcertRepositorySymbol = Symbol.for("ConcertRepository");

export interface ConcertRepository {
  selectAll(_manager?: EntityManager): Promise<ConcertEntity[]>;
}
