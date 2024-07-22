import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { mockAppModule } from "../App.module";

let mockModule: TestingModule;
let app: INestApplication;
let dataSource: DataSource;
beforeAll(async () => {
  mockModule = await Test.createTestingModule({
    imports: [...mockAppModule],
  }).compile();

  app = mockModule.createNestApplication();
  dataSource = mockModule.get<DataSource>(DataSource);

  // 전역 변수를 설정하여 각 테스트에서 접근할 수 있도록 합니다.
  global.mockModule = mockModule;

  await app.init();
});

afterAll(async () => {
  // 데이터 정리
  await dataSource.dropDatabase();
  await app.close();
});
