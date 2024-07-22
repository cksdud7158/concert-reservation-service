import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";
import WaitingQueueEntity from "@app/domain/entity/waiting-queue.entity";

class WaitingQueueMapper {
  static toDomain(waitingQueue: WaitingQueue): WaitingQueueEntity {
    return new WaitingQueueEntity({
      id: waitingQueue.id,
      creat_at: waitingQueue.creat_at,
      update_at: waitingQueue.update_at,
      user_id: waitingQueue.user_id,
      orderNum: waitingQueue.orderNum,
      status: waitingQueue.status,
    });
  }
}

export default WaitingQueueMapper;
