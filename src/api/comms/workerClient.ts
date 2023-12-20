import { MessageWrapper, toMessageWrapper } from './sharedMessageWrapper';
import { EventTypeEnum } from './eventTypeEnum';

export type WorkerClientInput = {
    onMessage: (message: string) => void,
    onError: (e: Error) => void
};

export type WorkerClient = {
    send: (message: string, eventType: EventTypeEnum) => void,
    close: () => void
};

const portId = crypto.randomUUID();
let worker: SharedWorker;

const send = (message: string, eventType: EventTypeEnum) => {
    worker?.port.postMessage(toMessageWrapper(portId, eventType, message));
};

const close = () => {
    worker?.port.close();
}

export const createWorkerClient = ({onMessage, onError}: WorkerClientInput): WorkerClient => {

    if (worker === undefined) {
        worker = new SharedWorker('../sharedWorker.ts', { type: 'module' });

        worker.onerror = ({ error }: ErrorEvent) => onError(new Error(`Error in the shared worker: ${error}`));
        worker.port.onmessageerror = ({ data }: MessageEvent) => onError(new Error(`Error when communicating with the shared worker: ${data.toString()}`));
        worker.port.onmessage = msg => {
            const data = msg.data as MessageWrapper;
            if (data?.portId === portId)
                onMessage(msg.data.message);
        }
    }

    //worker.port.start(); // not needed as worker.port.onmessage implicitly starts the port

    return { send, close };
};
