

export const start = () => {

    const id = crypto.randomUUID();

    const worker = new SharedWorker('../sharedWorker.ts', { type: 'module' });

    worker.onerror = (e: ErrorEvent) => console.error(`Error in the shared worker: ${e.error}`);

    worker.port.onmessageerror = (e: MessageEvent) => console.error(`Error when communicating with the shared worker: ${e.data.toString()}`);

    worker.port.onmessage = msg => console.log(msg.data.toString());

    worker.port.start();


};