import { createWebSocket, WebSocketWrapper } from './webSocketWrapper';
import { EventTypeEnum, Status } from './enums';

export {};

const MARKET_DATA_URL = 'ws://localhost:8090/market-data-ws';

type ServerEventContainer = {
    topic: string,
    payload?: string,
};

const ports: MessagePort[] = [];
const topicPortsMap = new Map<string, MessagePort[]>();
let ws: WebSocketWrapper;

self.onconnect = ({ ports: [port] }: MessageEvent) => {
    ports.push(port);
    port.onmessage = (m: MessageEvent) => onPortMessageReceived(m, port);
};

const onPortMessageReceived = (m: MessageEvent, port: MessagePort) => {
    switch (m.type) {
        case EventTypeEnum.subscribeToMarketData: {
            // todo
            break;
        }
        case EventTypeEnum.unsubscribeFromMarketData: {
            // todo
            break;
        }
        case EventTypeEnum.closePort: {
            port.close();
            const topicsToUnsubscribeFrom = [];
            for (const [topic, portList] of topicPortsMap){
                const i = portList.findIndex(p => p == port);
                if (i >= 0) {
                    portList.splice(i, 1);
                    if (portList.length === 0) topicsToUnsubscribeFrom.push(topic);
                }
            }

            // todo: unsubscribe from topicsToUnsubscribeFrom

            break;
        }
        default: console.error(`Unexpected message type was received: ${m.type}`);
    }
};

const broadcast = (message: { type: EventTypeEnum, data: any | undefined }) => ports.forEach(p => p.postMessage(message));

const connectToWebSocket = () => {
    if (!ws)
         ws = createWebSocket(
            MARKET_DATA_URL,
            message => handleWsMessage(message),
            () => broadcast({type: EventTypeEnum.error, data: { error: 'An error occurred in the websocket connection.' }}),
             () => broadcast({type: EventTypeEnum.connectionStatusChange, data: { status: Status.Open }}),
             () => broadcast({type: EventTypeEnum.connectionStatusChange, data: { status: Status.Closed }}),
        );
};

const handleWsMessage = (message: MessageEvent) => {
    try {
        const msg = JSON.parse(message.data) as ServerEventContainer;

        if (!topicPortsMap.has(msg.topic)) {
            console.error(`Unknown topic name received from server: ${msg.topic}`);
            return;
        }

        const ports = topicPortsMap.get(msg.topic) ?? [];
        for (const p of ports) p.postMessage(msg.payload);
    } catch (err) {
        console.error(`An error occurred while consuming server message. ${err}`);
    }
};