import { EventBus } from "@nestjs/cqrs";

export const eventbusProvider = {
  provide: EventBus,
  useValue: {
    publish: jest.fn(),
  },
};
