import PointEntity from "@app/domain/entity/user/point.entity";

class PointMapper {
  static toDomain(point: number): PointEntity {
    return new PointEntity({ point });
  }
}

export default PointMapper;
