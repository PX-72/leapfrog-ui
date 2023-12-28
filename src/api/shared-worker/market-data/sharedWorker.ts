import { createWebSocket, WebSocketWrapper } from '../../ws/webSocketWrapper';
import { Status } from '@/api/ws/Status';
import { createTopicPortsMap } from '../topicPortsMap';
import { CurrencyPairPayload, LogType, PortEventType, PortPayload } from '@/api/shared-worker/market-data/PortPayload';
import { MarketData } from '@/api/types';

export {};

const MARKET_DATA_URL = 'ws://localhost:8090/market-data-ws';

const ports = new Set<MessagePort>();
const subscriptionMap = createTopicPortsMap();
let ws: WebSocketWrapper;

self.onconnect = ({ ports: [port] }: MessageEvent) => {
    ports.add(port);
    postLogMessage(`Added new port. Port count: ${ ports.size }`, 'debug');

    // let subsequent ports know about the ws status, as the ws connection is only established by the first port,
    // so subsequent ports would not know about the status otherwise.
    const status: Status = ws && ws.getStatus() === Status.Ready ? Status.Ready : Status.Closed;
    port.postMessage({type: PortEventType.ConnectionStatusChange, payload: { status: status }});

    port.onmessage = (m: MessageEvent) => onPortMessageReceived(m, port);

    connectToWs();
};

const broadcast = (message: PortPayload) => ports.forEach(p => p.postMessage(message));

const postLogMessage = (message: string, logType: LogType, targetPort?: MessagePort) => {
    const msg = { type: PortEventType.Log, payload: { logType, message }};
    if (targetPort) {
        targetPort.postMessage(msg);
        return;
    }

    if (ports.size === 0) {
        console.error('No ports found to send log message.');
        if (logType === 'error') console.error(message);
        else console.log(message);
        return;
    }

    broadcast(msg);
};

const postError = (error: string, port?: MessagePort) => {
    const e = {type: PortEventType.Error, payload: { error }};
    if (!port) broadcast(e);
    else port.postMessage(e);
};

const onPortMessageReceived = (m: MessageEvent, port: MessagePort) => {
    const portPayload = m.data as PortPayload;
    postLogMessage(`Port message received: ${JSON.stringify(portPayload)}`, 'debug', port);
    switch (portPayload.type) {
        case PortEventType.SubscribeToMarketData: {
            const ccyPairPayload = portPayload.payload as CurrencyPairPayload;
            let mustSubscribe = subscriptionMap.addPort(ccyPairPayload.currencyPair, port);
            if (mustSubscribe)
                sendWsMessage(portPayload, port);
            break;
        }
        case PortEventType.UnsubscribeFromMarketData: {
            const ccyPairPayload = portPayload.payload as CurrencyPairPayload;
            let mustUnsubscribe = subscriptionMap.removePortForKey(ccyPairPayload.currencyPair, port);
            if (mustUnsubscribe)
                sendWsMessage(portPayload, port);
            break;
        }
        case PortEventType.ClosePort: {
            const topicsToUnsubscribeFrom = subscriptionMap.removePort(port);
            topicsToUnsubscribeFrom.forEach(currencyPair =>
                sendWsMessage({ type: PortEventType.UnsubscribeFromMarketData, payload: { currencyPair } }, port));

            postLogMessage('Closing port.', 'debug', port);
            port.close();
            ports.delete(port);

            break;
        }
        default: postLogMessage(`Unexpected message type was received: ${m.data.type}`, 'error', port);
    }
};

const connectToWs = () => {
    if (ws) return;

    postLogMessage('Connecting to web socket', 'debug');
    ws = createWebSocket(
        MARKET_DATA_URL,
        message => handleWsMessage(message),
        () => postError('An error occurred in the websocket connection.'),
        () => broadcast({type: PortEventType.ConnectionStatusChange, payload: { status: Status.Ready }}),
        () => broadcast({type: PortEventType.ConnectionStatusChange, payload: { status: Status.Closed }}),
    );
};

// must match bff enum
const enum ServerEventType {
    SUBSCRIBE_TO_MARKET_DATA = 0,
    UNSUBSCRIBE_FROM_MARKET_DATA = 1,
    MARKET_DATA_RESPONSE = 2
}

const sendWsMessage = (portMessage: PortPayload, sourcePort?: MessagePort) => {
    const {type, payload} = portMessage;

    if (!ws || ws.getStatus() !== Status.Ready) {
        postLogMessage(`Websocket is not ready. Message cannot be sent: type: ${type}.`, 'error', sourcePort);
        postError('Connection is not ready. Message could not be sent.', sourcePort);
        return;
    }

    let serverEventType: ServerEventType;
    if (type === PortEventType.SubscribeToMarketData) serverEventType = ServerEventType.SUBSCRIBE_TO_MARKET_DATA;
    else if (type === PortEventType.UnsubscribeFromMarketData) serverEventType = ServerEventType.UNSUBSCRIBE_FROM_MARKET_DATA;
    else {
        postLogMessage(`Unexpected server event type: ${type}.`, 'error', sourcePort);
        postError(`Unexpected server event type: ${type}.`, sourcePort);
        return;
    }

    const msg = JSON.stringify({ type: serverEventType, payload });
    postLogMessage(`Sending message to server: ${msg}`, 'debug', sourcePort);
    ws.send(msg);
};

const handleWsMessage = (message: MessageEvent) => {
    try {
        const { type, payload } = JSON.parse(message.data);
        switch (type) {
            case ServerEventType.MARKET_DATA_RESPONSE: {
                const marketData = payload as MarketData;
                const portList = subscriptionMap.getPortsByKey(marketData.ccyPair);
                portList.forEach(p => p.postMessage(
                    { type: PortEventType.MarketDataResponse, payload: marketData }
                ));
                break;
            }
            default: postLogMessage(`Unexpected server message type was received: ${type}`, 'error');
        }
    } catch (err) {
        postLogMessage(`An error occurred while consuming server message. ${err}`, 'error');
    }
};
