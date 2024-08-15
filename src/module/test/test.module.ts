import { Module } from "@nestjs/common";
import { TestController } from "@app/presentation/controller/test/test.controller";
import { KafkaModule } from "@app/module/event/kafka.module";

@Module({
  imports: [KafkaModule],
  controllers: [TestController],
})
export class TestModule {}
