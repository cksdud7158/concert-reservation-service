import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { mockAppModule } from "../App.module";
import Redis from "ioredis";
import { RedisClientSymbol } from "@app/module/provider/redis/redis.provider";

let mockModule: TestingModule;
let app: INestApplication;
let dataSource: DataSource;
let redis: Redis;

beforeAll(async () => {
  mockModule = await Test.createTestingModule({
    imports: [...mockAppModule],
  }).compile();

  app = mockModule.createNestApplication();
  dataSource = mockModule.get<DataSource>(DataSource);
  redis = mockModule.get(RedisClientSymbol);

  // 전역 변수를 설정하여 각 테스트에서 접근할 수 있도록 합니다.
  global.mockModule = mockModule;
  global.redis = redis;

  await app.init();
});

afterAll(async () => {
  // 데이터 정리
  await dataSource.dropDatabase();
  const keys = await redis.keys("*test*");
  if (keys.length > 0) {
    await redis.del(keys);
  }
  redis.quit();
  await app.close();
});
