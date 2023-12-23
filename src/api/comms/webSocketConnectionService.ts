import { EventType } from './enums';
import { createWebSocket, WebSocketWrapper } from './webSocketWrapper';

type QueueItemType = {
    eventType: EventType,
    messageEvent: MessageEvent
};

const queue: QueueItemType[] = [];
let ws: WebSocketWrapper;

const add = ({ eventType, messageEvent }: QueueItemType) => queue.push({ eventType, messageEvent });

function* take() {
    while (queue.length > 0) {
        yield queue.shift();
    }
}

const send = (message: string) => {

}





//export default { add, take };
