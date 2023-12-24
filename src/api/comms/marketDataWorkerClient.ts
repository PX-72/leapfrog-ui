import { EventType, Status } from './enums';
import { MarketData } from '@/api/types';
import { subscribe } from 'diagnostics_channel';

type MarketDataSubscription = (marketData: MarketData) => void;
type ErrorSubscription = (error: Error) => void;

const marketDataSubscriptionSet = new Set<MarketDataSubscription>();
const errorSubscriptionSet = new Set<ErrorSubscription>();

let worker: SharedWorker | null;
let currentStatus: Status = Status.Closed;

const onMessage = (m: MessageEvent) => {
    switch (m.type) {
        case EventType.Error: {

            break;
        }
        case EventType.ConnectionStatusChange: {

            break;
        }
        case EventType.MarketDataResponse: {


            break;
        }
        default: console.error(`Unexpected message type was received by marketDataWorkerClient: ${m.type}`);
    }
}

const connect = () => {
    if (!worker) {
        worker = new SharedWorker('../marketDataSharedWorker.ts', { type: 'module' });
        worker.port.onmessage = onMessage;
        worker.onerror = ({ error }: ErrorEvent) => console.error(`Error in the shared worker: ${error}`);
        worker.port.onmessageerror = ({ data }: MessageEvent) =>
            console.error(`Error when communicating with the shared worker: ${data.toString()}`);
    }
};

const close = () => {
    worker?.port.postMessage({ type: EventType.ClosePort });
    currentStatus = Status.Closed;
    worker = null;
};

const subscribeToMarketData = (subscription: MarketDataSubscription) => marketDataSubscriptionSet.add(subscription);
const unsubscribeFromMarketData = (subscription: MarketDataSubscription) => marketDataSubscriptionSet.delete(subscription);

const subscribeToError = (subscription: ErrorSubscription) => errorSubscriptionSet.add(subscription);
const unsubscribeFromError = (subscription: ErrorSubscription) => errorSubscriptionSet.delete(subscription);

