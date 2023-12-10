export const start = () => {
    // const id = crypto.randomUUID();
    const worker = new SharedWorker('../sharedWorker.ts', { type: 'module' });

    worker.onerror = ({ error }: ErrorEvent) => console.error(`Error in the shared worker: ${error}`);
    worker.port.onmessageerror = ({ data }: MessageEvent) => console.error(`Error when communicating with the shared worker: ${data.toString()}`);
    worker.port.onmessage = ({ data }: MessageEvent) => console.log(data.toString());

    worker.port.start();
};
