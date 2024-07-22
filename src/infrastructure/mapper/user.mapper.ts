import { User } from "@app/infrastructure/entity/user.entity";
import { UserEntity } from "@app/domain/entity/user.entity";

class UserMapper {
  static toDomain(user: User): UserEntity {
    return new UserEntity({
      id: user.id,
      creat_at: user.creat_at,
      update_at: user.update_at,
      point: user.point,
    });
  }
}

export default UserMapper;
