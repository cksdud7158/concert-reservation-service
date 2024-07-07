import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import setupSwagger from "./config/swagger/setup-swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger 세팅
  setupSwagger(app);

  await app.listen(3000);
}

bootstrap();
