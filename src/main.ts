import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import setupSwagger from "./config/swagger/setup-swagger";
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "@app/presentation/filter/globalException";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 입력 데이터를 DTO로 변환
      whitelist: true, // DTO에 정의되지 않은 속성은 필터링
    }),
  );

  // swagger 세팅
  setupSwagger(app);

  await app.listen(3000);
}

bootstrap();
