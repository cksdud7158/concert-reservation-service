import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  TestProducer,
  TestProducerSymbol,
} from "@app/domain/interface/message/test/test.producer";
import TestTopicEnum from "@app/domain/enum/message/test/test.topic.enum";

@Controller("test")
export class TestController {
  constructor(
    @Inject(TestProducerSymbol)
    private readonly testProducer: TestProducer,
  ) {}

  @Get("")
  async producerTest(): Promise<void> {
    try {
      // 카프카 메시지 발행
      await this.testProducer.sendMessage(TestTopicEnum.TEST_TOPIC, {
        value: "test data",
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
