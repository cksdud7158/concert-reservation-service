import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("콘서트 예약 Docs")
    .setDescription("The concert reservation API description")
    .setVersion("1.0")
    .addTag("concert")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
}

export default setupSwagger;
