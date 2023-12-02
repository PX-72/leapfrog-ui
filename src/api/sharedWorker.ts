export {};

const ports: MessagePort[] = [];
const sessionPortMap = new Map<string, MessagePort>();
let isRunning = false;
let counter = 0;

self.onconnect = ({ ports: [port] }: MessageEvent) => {
    ports.push(port);

    port.onmessage = (m: MessageEvent) => {
        console.log(`ID: ${m.data}`);
    };
};

