import { ErrorPayload, LogPayload, PortEventType, PortPayload, StatusPayload } from './PortPayload';
import { Status } from '@/api/ws/Status';
import { MarketData } from '@/api/types';

type MarketDataListener = (marketData: MarketData) => void;
type ErrorListener = (error: string) => void;

const marketDataListenerSet = new Set<MarketDataListener>();
const errorListenerSet = new Set<ErrorListener>();

let worker: SharedWorker | null;
let currentStatus: Status = Status.Closed;

const handleError = (error: string, moreInfo: string = '') => {
    const msg = `${moreInfo} Error: ${error}`;
    console.error(msg);
    errorListenerSet.forEach(s => s(msg));
};

const onMessage = (m: MessageEvent) => {
    const portPayload = m.data as PortPayload;
    switch (portPayload.type) {
        case PortEventType.Error: {
            const e = portPayload.payload as ErrorPayload;
            handleError(e.error);
            break;
        }
        case PortEventType.ConnectionStatusChange: {
            const newStatus = portPayload.payload as StatusPayload;
            currentStatus = newStatus.status;
            break;
        }
        case PortEventType.MarketDataResponse: {
            const marketData = portPayload.payload as MarketData;
            marketDataListenerSet.forEach(s => s(marketData));
            break;
        }
        case PortEventType.Log: {
            const logEvent = portPayload.payload as LogPayload;
            const logPrefix = '[SHARED WORKER]:';
            if (logEvent.logType === 'error') console.error(`${logPrefix} ${logEvent.message}`);
            else console.log(`${logPrefix} ${logEvent.message}`);
            break;
        }
        default: console.error(`Unexpected message type was received by marketDataWorkerClient: ${m.data.type}`);
    }
};

const connect = () => {
    if (worker) return;
    worker = new SharedWorker('./src/api/shared-worker/market-data/sharedWorker.ts', { type: 'module' });
    worker.port.onmessage = onMessage;
    worker.onerror = (e: ErrorEvent) => handleError(e.error?.toString(), 'Error in the shared worker.');
    worker.port.onmessageerror = (e: MessageEvent) =>
        handleError(e.data?.toString(), `Error when communicating with the shared worker.`);
};

const close = () => {
    worker?.port.postMessage({ type: PortEventType.ClosePort });
    currentStatus = Status.Closed;
    worker = null;
};

const postSubscriptionMsg = (type: PortEventType, currencyPair: string) => {
    if (!worker || !isReady()){
        const subType = type === PortEventType.SubscribeToMarketData ? 'subscribe' : 'unsubscribe';
        throw new Error(`Cannot ${subType} to market data (${currencyPair}). Server connection is not ready.`);
    }

    const message: PortPayload = { type, payload: { currencyPair } };

    worker.port.postMessage(message);
}

export const marketDataConnection = { connect, close };

export const isReady = (): boolean => currentStatus === Status.Ready;

export const marketDataListener = {
    add: (listener: MarketDataListener) => marketDataListenerSet.add(listener),
    remove: (listener: MarketDataListener) => marketDataListenerSet.delete(listener)
};

export const errorListener = {
    add: (listener: ErrorListener) => errorListenerSet.add(listener),
    remove: (listener: ErrorListener) => errorListenerSet.delete(listener)
};

export const subscribeToMarketData = (currencyPair: string) =>
    postSubscriptionMsg(PortEventType.SubscribeToMarketData, currencyPair);

export const unsubscribeFromMarketData = (currencyPair: string) =>
    postSubscriptionMsg(PortEventType.UnsubscribeFromMarketData, currencyPair);
