import { MessageWrapper, toMessageWrapper } from './sharedMessageWrapper';
import { EventType, Status } from './enums';

export type WorkerClientInput = {
    onMessage: (message: string) => void,
    onError: (e: Error) => void
};

export type WorkerClient = {
    send: (message: string, eventType: EventType) => void,
    close: () => void
};

const portId = crypto.randomUUID();
let worker: SharedWorker;
let currentStatus: Status = Status.Closed;

const getSharedWorker = () => new SharedWorker('../marketDataSharedWorker.ts', { type: 'module' });

export const send = (message: string, eventType: EventType) => {
    if (worker === undefined)
        worker = getSharedWorker();

    worker?.port.postMessage(toMessageWrapper(portId, eventType, message));
};

export const close = () => {
    worker?.port.close();
};

export const onMessage = ({onMessage, onError}: WorkerClientInput): void => {

    if (worker === undefined) {
        worker = getSharedWorker();

        worker.port.onmessage = msg => {
            const data = msg.data as MessageWrapper;
            if (data?.portId === portId)
                onMessage(msg.data.message);
        };
    }

    //worker.port.start(); // not needed as worker.port.onmessage implicitly starts the port
};

export const onError = ({onError}: WorkerClientInput): void => {

    if (worker === undefined) {
        worker = getSharedWorker();

        worker.onerror = ({ error }: ErrorEvent) => onError(new Error(`Error in the shared worker: ${error}`));
        worker.port.onmessageerror = ({ data }: MessageEvent) =>
            onError(new Error(`Error when communicating with the shared worker: ${data.toString()}`));
    }

    //worker.port.start(); // not needed as worker.port.onmessage implicitly starts the port
};
