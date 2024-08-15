import { Test, TestingModule } from "@nestjs/testing";

import TestTopicEnum from "@app/domain/enum/message/test/test.topic.enum";
import {
  TestProducer,
  TestProducerSymbol,
} from "@app/domain/interface/message/test/test.producer";
import { TestConsumer } from "@app/presentation/consumer/test/test.consumer";
import { KafkaModule } from "@app/module/event/kafka.module";
import { EachMessagePayload } from "kafkajs";

describe("Kafka 통합 테스트", () => {
  let kafkaProducerService: TestProducer;
  let kafkaConsumerService: TestConsumer;
  let testingModule: TestingModule;
  let payload: EachMessagePayload | undefined;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [KafkaModule],
    }).compile();

    kafkaProducerService = testingModule.get<TestProducer>(TestProducerSymbol);
    kafkaConsumerService = testingModule.get<TestConsumer>(TestConsumer);

    payload = undefined;

    await testingModule.init();
  });

  afterEach(async () => {
    await kafkaConsumerService.disconnectConsumer();
    await testingModule.close();
  });

  const message = { key: "test-key", value: "test-value" };

  it("메시지 정상 송신 및 수신", async () => {
    // given
    // 컨슈머의 메시지 처리 로직을 목(mock)으로 교체
    jest
      .spyOn(kafkaConsumerService, "handleMessage")
      .mockImplementation(async (val) => {
        payload = val;
        console.log(`Mock consumer received: ${JSON.stringify(val)}`);
      });

    // when
    // 프로듀서가 메시지를 보냅니다.
    await kafkaProducerService.sendMessage(TestTopicEnum.TEST_TOPIC, message);

    // 메시지가 컨슈머로 전달될 시간을 기다립니다.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // then
    // 컨슈머가 메시지를 수신했는지 확인합니다.
    expect(payload).toBeDefined();
    if (payload) {
      expect(payload.topic).toBe(TestTopicEnum.TEST_TOPIC);
      expect(payload.message.value.toString()).toBe(message.value);
      expect(payload.message.key.toString()).toBe(message.key);
    }
  });

  it("컨슈머에서 에러 발생 시", async () => {
    // given
    jest
      .spyOn(kafkaConsumerService, "handleMessage")
      .mockImplementation(async (message) => {
        throw new Error("Simulated processing error");
      });

    // when
    await kafkaProducerService.sendMessage(TestTopicEnum.TEST_TOPIC, message);

    // 메시지가 컨슈머로 전달될 시간을 기다립니다.
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 대기

    // then
    expect(kafkaConsumerService.handleMessage).toHaveBeenCalled();
    try {
      await kafkaConsumerService.handleMessage({} as EachMessagePayload);
    } catch (error) {
      expect(error.message).toBe("Simulated processing error");
    }
  });

  it("잘못된 메시지 구조를 발행", async () => {
    const invalidMessage = null;

    await expect(
      kafkaProducerService.sendMessage(
        TestTopicEnum.TEST_TOPIC,
        invalidMessage,
      ),
    ).rejects.toThrowError();
  });
});
