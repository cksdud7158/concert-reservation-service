import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";
import WaitingQueueEntity from "@app/domain/entity/waiting-queue.entity";

class WaitingQueueMapper {
  static toDomain(waitingQueue: WaitingQueue): WaitingQueueEntity {
    return new WaitingQueueEntity(
      waitingQueue.id,
      waitingQueue.creat_at,
      waitingQueue.update_at,
      waitingQueue.user_id,
      waitingQueue.orderNum,
      waitingQueue.status,
    );
  }
}

export default WaitingQueueMapper;
