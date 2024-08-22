import { Inject, Injectable } from "@nestjs/common";
import { UserService } from "@app/domain/service/user/user.service";
import { TokenService } from "@app/domain/service/token/token.service";
import { CacheService } from "@app/domain/service/cache/cache.service";
import RedisKey from "@app/domain/enum/redis/redis-key.enum";

@Injectable()
export class GetTokenUseCase {
  constructor(
    @Inject() private readonly tokenService: TokenService,
    @Inject() private readonly userService: UserService,
    @Inject() private readonly cacheService: CacheService,
  ) {}

  async execute(userId: number): Promise<string> {
    // 해당 유저 있는지 확인
    // 캐시 조회
    const key = RedisKey.USER_CACHE + userId;
    let user = await this.cacheService.getCache(key);
    // 있으면 리턴
    if (!user?.id) {
      user = await this.userService.hasUser(userId);
      await this.cacheService.setCache(key, user);
    }

    return await this.tokenService.getToken(userId);
  }
}
