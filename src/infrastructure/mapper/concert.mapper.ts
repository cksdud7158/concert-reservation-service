import { ConcertEntity } from "@app/domain/entity/concert.entity";
import { Concert } from "@app/infrastructure/entity/concert.entity";

class ConcertMapper {
  static toDomain(concert: Concert): ConcertEntity {
    return new ConcertEntity({
      id: concert.id,
      creat_at: concert.creat_at,
      update_at: concert.update_at,
      name: concert.name,
    });
  }
}

export default ConcertMapper;
