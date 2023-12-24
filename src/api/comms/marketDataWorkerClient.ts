import { EventType, Status } from './enums';
import { MarketData } from '@/api/types';

type MarketDataSubscription = (marketData: MarketData) => void;
type ErrorSubscription = (error: string) => void;

const marketDataSubscriptionSet = new Set<MarketDataSubscription>();
const errorSubscriptionSet = new Set<ErrorSubscription>();

let worker: SharedWorker | null;
let currentStatus: Status = Status.Closed;

const handleError = (e: MessageEvent | ErrorEvent, moreInfo: string = '') => {
    let error = '';
    if (e instanceof MessageEvent) error = e.data;
    else if (e instanceof ErrorEvent) error = e.error;

    const msg = `${moreInfo} Error: ${error}`;
    console.error(msg);
    errorSubscriptionSet.forEach(s => s(msg));
};

const onMessage = (m: MessageEvent) => {
    console.log(m);
    switch (m.data.type) {
        case EventType.Error: {
            handleError(m);
            break;
        }
        case EventType.ConnectionStatusChange: {
            currentStatus = m.data.payload?.status as Status;
            break;
        }
        case EventType.MarketDataResponse: {
            const marketData= JSON.parse(m.data.payload) as MarketData;
            marketDataSubscriptionSet.forEach(s => s(marketData));
            break;
        }
        default: console.error(`Unexpected message type was received by marketDataWorkerClient: ${m.data.type}`);
    }
};

const connect = () => {
    if (worker) return;
    worker = new SharedWorker('./src/api/comms/marketDataSharedWorker.ts', { type: 'module' });
    worker.port.onmessage = onMessage;
    worker.onerror = (e: ErrorEvent) => handleError(e, 'Error in the shared worker.');
    worker.port.onmessageerror = (e: MessageEvent) => handleError(e, `Error when communicating with the shared worker.`);
};

const close = () => {
    worker?.port.postMessage({ type: EventType.ClosePort });
    currentStatus = Status.Closed;
    worker = null;
};

export const marketDataConnection = { connect, close };

export const isReady = (): boolean => currentStatus === Status.Ready;

export const subscribeToMarketData = (subscription: MarketDataSubscription) => marketDataSubscriptionSet.add(subscription);
export const unsubscribeFromMarketData = (subscription: MarketDataSubscription) => marketDataSubscriptionSet.delete(subscription);

export const subscribeToError = (subscription: ErrorSubscription) => errorSubscriptionSet.add(subscription);
export const unsubscribeFromError = (subscription: ErrorSubscription) => errorSubscriptionSet.delete(subscription);

