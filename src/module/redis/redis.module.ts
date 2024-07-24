import { Global, Module } from "@nestjs/common";
import redisProvider from "@app/module/provider/redis.provider";
import { LockService } from "@app/domain/service/redis/redis.service";

@Global()
@Module({
  providers: [redisProvider, LockService],
  exports: [LockService],
})
export class RedisModule {}
