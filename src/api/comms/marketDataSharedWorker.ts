import { createWebSocket, WebSocketWrapper } from './webSocketWrapper';
import { EventType, Status } from './enums';
import messageEventQueue from './subscriptionService';
import subscriptionMap from './subscriptionMap';

export {};

const MARKET_DATA_URL = 'ws://localhost:8090/market-data-ws';

type ServerEventContainer = {
    topic: string,
    payload?: string,
};

const ports: MessagePort[] = [];
let ws: WebSocketWrapper;

self.onconnect = ({ ports: [port] }: MessageEvent) => {
    ports.push(port);
    port.onmessage = (m: MessageEvent) => onPortMessageReceived(m, port);
};

const onPortMessageReceived = (m: MessageEvent, port: MessagePort) => {
    switch (m.type) {
        case EventType.SubscribeToMarketData: {
            let mustSubscribe = subscriptionMap.addPort(m.data.currencyPair, port);

            // todo: if (mustSubscribe) subscribe()

            break;
        }
        case EventType.UnsubscribeFromMarketData: {
            let mustUnsubscribe = subscriptionMap.removePortForKey(m.data.currencyPair, port);

            // todo: if (mustUnsubscribe) unsubscribe()

            break;
        }
        case EventType.ClosePort: {
            port.close();

            const i = ports.indexOf(port);
            if (i >= 0) ports.splice(i, 1);

            const topicsToUnsubscribeFrom = subscriptionMap.removePort(port);
            // todo: unsubscribe from topicsToUnsubscribeFrom

            break;
        }
        default: console.error(`Unexpected message type was received: ${m.type}`);
    }
};

const broadcast = (message: { type: EventType, data: any | undefined }) => ports.forEach(p => p.postMessage(message));

const connectToWebSocket = () => {
    if (!ws)
         ws = createWebSocket(
            MARKET_DATA_URL,
            message => handleWsMessage(message),
            () => broadcast({type: EventType.Error, data: { error: 'An error occurred in the websocket connection.' }}),
             () => broadcast({type: EventType.ConnectionStatusChange, data: { status: Status.Ready }}),
             () => broadcast({type: EventType.ConnectionStatusChange, data: { status: Status.Closed }}),
        );
};

const handleWsMessage = (message: MessageEvent) => {
    try {
        const msg = JSON.parse(message.data) as ServerEventContainer;
        const ports = subscriptionMap.getPortsByKey(msg.topic) ?? [];
        for (const p of ports) p.postMessage(msg.payload);
    } catch (err) {
        console.error(`An error occurred while consuming server message. ${err}`);
    }
};
