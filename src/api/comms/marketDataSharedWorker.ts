import { createWebSocket, WebSocketWrapper } from './webSocketWrapper';
import { EventType, Status } from './enums';
import subscriptionMap from './topicPortsMap';

export {};

const MARKET_DATA_URL = 'ws://localhost:8090/market-data-ws';

type ServerEventContainer = {
    topic: string,
    payload?: string
};

const ports: MessagePort[] = []; //todo: use set
let ws: WebSocketWrapper;

const broadcast = (message: { type: EventType, payload: any }) => ports.forEach(p => p.postMessage(message));

const postError = (error: string, port?: MessagePort) => {
    const e = {type: EventType.Error, payload: { error }};
    if (!port) broadcast(e);
    else port.postMessage(e);
};

const sendWsMessage = (message: string, sourcePort?: MessagePort) => {
    if (!ws || ws.getStatus() !== Status.Ready) {
        postError('Connection is not ready. Message could not be sent.', sourcePort);
    } else ws.send(message);
};

const getMarketDataMessage = (type: EventType, currencyPair: string): string => JSON.stringify({ type, currencyPair });

self.onconnect = ({ ports: [port] }: MessageEvent) => {
    ports.push(port);
    port.onmessage = (m: MessageEvent) => onPortMessageReceived(m, port);

    connectToWebSocket();
};

const onPortMessageReceived = (m: MessageEvent, port: MessagePort) => {
    switch (m.data.type) {
        case EventType.SubscribeToMarketData: {
            let mustSubscribe = subscriptionMap.addPort(m.data.payload.currencyPair, port);
            if (mustSubscribe)
                sendWsMessage(getMarketDataMessage(EventType.SubscribeToMarketData, m.data.payload.currencyPair), port);
            break;
        }
        case EventType.UnsubscribeFromMarketData: {
            let mustUnsubscribe = subscriptionMap.removePortForKey(m.data.payload.currencyPair, port);
            if (mustUnsubscribe)
                sendWsMessage(getMarketDataMessage(EventType.UnsubscribeFromMarketData, m.data.payload.currencyPair), port);
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
        default: console.error(`Unexpected message type was received: ${m.data.type}`);
    }
};

const connectToWebSocket = () => {
     ws ??= createWebSocket(
        MARKET_DATA_URL,
        message => handleWsMessage(message),
        () => postError('An error occurred in the websocket connection.'),
         () => broadcast({type: EventType.ConnectionStatusChange, payload: { status: Status.Ready }}),
         () => broadcast({type: EventType.ConnectionStatusChange, payload: { status: Status.Closed }}),
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
