import { createWebSocket, WebSocketWrapper } from '@/api/comms/webSocketWrapper';
import { OperationTypeEnum } from '@/api/comms/operationTypeEnum';
import { MarketDataResponse } from '@/api/marketDataApi';

export {};

const MARKET_DATA_URL = 'ws://localhost:8090/market-data-ws';

type ServerEventContainer = {
    topic: string,
    payload?: string,
};

const ports: MessagePort[] = [];
const topicPortsMap = new Map<string, MessagePort[]>();
let ws: WebSocketWrapper;

self.onconnect = ({ ports: [port] }: MessageEvent) => {
    ports.push(port);

    port.onmessage = (m: MessageEvent) => {
        console.log(`ID: ${m.data}`);
        //const portMessage = m.data as


    };
};


const connectToWebSocket = () => {
     ws = createWebSocket(
        MARKET_DATA_URL,
        message => handleWsMessage(message),
        () => {}
    );
}

const handleWsMessage = (message: MessageEvent) => {
    try {
        const msg = JSON.parse(message.data) as ServerEventContainer;
        if (!topicPortsMap.has(msg.topic)) {
            console.error(`Unknown topic name received from server: ${msg.topic}`);
            return;
        }

        const ports = topicPortsMap.get(msg.topic) ?? [];
        for(const p of ports){
            p.postMessage(msg.payload);
        }
    } catch (err) {
        console.error(`An error occurred while consuming server message. ${err}`);
    }
}

