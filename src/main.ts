import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import setupSwagger from "./config/swagger/setup-swagger";
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "@app/presentation/filter/globalException";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // 부트스트래핑 과정까지 nest-winston 로거 사용
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 입력 데이터를 DTO로 변환
      whitelist: true, // DTO에 정의되지 않은 속성은 필터링
    }),
  );

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // swagger 세팅
  setupSwagger(app);

  await app.listen(3000);
}

bootstrap();
