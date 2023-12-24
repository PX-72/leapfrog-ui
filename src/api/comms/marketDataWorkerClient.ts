import { EventType, Status } from './enums';

let worker: SharedWorker | null;
let currentStatus: Status = Status.Closed;


const onMessage = (message: MessageEvent) => {

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