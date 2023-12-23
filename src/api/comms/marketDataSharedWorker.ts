import { createWebSocket, WebSocketWrapper } from './webSocketWrapper';
import { EventType, Status } from './enums';
import subscriptionMap from './topicPortsMap';

export {};

const MARKET_DATA_URL = 'ws://localhost:8090/market-data-ws';

type ServerEventContainer = {
    topic: string,
    payload?: string,
};

const ports: MessagePort[] = [];
let ws: WebSocketWrapper;

const broadcast = (message: { type: EventType, data: any | undefined }) => ports.forEach(p => p.postMessage(message));

const postError = (error: string, port: MessagePort | undefined) => {
    const e = {type: EventType.Error, data: { error }};
    if (!port) broadcast(e);
    else port.postMessage(e);
}

const sendWsMessage = (message: string, sourcePort: MessagePort | undefined) => {
    if (!ws || ws.getStatus() !== Status.Ready) {
        postError('Connection is not ready. Message could not be sent.', sourcePort);
        return;
    }

    ws.send(message);
}

const getMarketDataMessage = (type: EventType, currencyPair: string): string => JSON.stringify({ type, currencyPair });

self.onconnect = ({ ports: [port] }: MessageEvent) => {
    ports.push(port);
    port.onmessage = (m: MessageEvent) => onPortMessageReceived(m, port);

    connectToWebSocket();
};

const onPortMessageReceived = (m: MessageEvent, port: MessagePort) => {
    switch (m.type) {
        case EventType.SubscribeToMarketData: {
            let mustSubscribe = subscriptionMap.addPort(m.data.currencyPair, port);

            if (mustSubscribe)
                sendWsMessage(getMarketDataMessage(EventType.SubscribeToMarketData, m.data.currencyPair), port);

            break;
        }
        case EventType.UnsubscribeFromMarketData: {
            let mustUnsubscribe = subscriptionMap.removePortForKey(m.data.currencyPair, port);

            if (mustUnsubscribe)
                sendWsMessage(getMarketDataMessage(EventType.UnsubscribeFromMarketData, m.data.currencyPair), port);

            break;
        }
        case EventType.ClosePort: {
            const topicsToUnsubscribeFrom = subscriptionMap.removePort(port);
            topicsToUnsubscribeFrom.forEach(currencyPair =>
                sendWsMessage(getMarketDataMessage(EventType.UnsubscribeFromMarketData, currencyPair), port));

            port.close();

            const i = ports.indexOf(port);
            if (i > -1) ports.splice(i, 1);

            break;
        }
        default: console.error(`Unexpected message type was received: ${m.type}`);
    }
};

const connectToWebSocket = () => {
    if (!ws)
         ws = createWebSocket(
            MARKET_DATA_URL,
            message => handleWsMessage(message),
            () => postError('An error occurred in the websocket connection.', undefined),
             () => broadcast({type: EventType.ConnectionStatusChange, data: { status: Status.Ready }}),
             () => broadcast({type: EventType.ConnectionStatusChange, data: { status: Status.Closed }}),
        );
};

const handleWsMessage = (message: MessageEvent) => {
    try {
        const msg = JSON.parse(message.data) as ServerEventContainer;
        const portList = subscriptionMap.getPortsByKey(msg.topic) ?? [];
        portList.forEach(p => p.postMessage(msg.payload));
    } catch (err) {
        console.error(`An error occurred while consuming server message. ${err}`);
    }
};
