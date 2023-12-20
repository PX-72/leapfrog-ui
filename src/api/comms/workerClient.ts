
export type WorkerClientInput = {
    onMessage: ({ data }: MessageEvent) => void,
    onError: (e: Error) => void
};

export type WorkerClientReturn = {
    send: (message: string) => void,
    close: () => void
};


const id = crypto.randomUUID();
let worker: SharedWorker;

const send = (message: string) => {
    worker?.port.postMessage(message);
};

const close = () => {
    worker?.port.close();
}

export const createWorkerClient = ({onMessage, onError}: WorkerClientInput): WorkerClientReturn => {

    if (worker === undefined)
        worker = new SharedWorker('../sharedWorker.ts', { type: 'module' });

    worker.onerror = ({ error }: ErrorEvent) => onError(new Error(`Error in the shared worker: ${error}`));
    worker.port.onmessageerror = ({ data }: MessageEvent) => onError(new Error(`Error when communicating with the shared worker: ${data.toString()}`));
    worker.port.onmessage = onMessage;

    //worker.port.start(); // not needed as worker.port.onmessage implicitly starts the port

    return { send, close };
};
