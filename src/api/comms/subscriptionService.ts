import { EventType } from './enums';

export type QueueItemType = {
    eventType: EventType,
    messageEvent: MessageEvent
};

const queue: QueueItemType[] = [];

const add = ({ eventType, messageEvent }: QueueItemType) => queue.push({ eventType, messageEvent });

function* take() {
    while (queue.length > 0) {
        yield queue.shift();
    }
}

export default { add, take };
