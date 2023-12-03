import { createWebSocket } from '@/api/comms/webSocketWrapper';
import { OperationTypeEnum } from '@/api/comms/operationTypeEnum';
import { MarketDataResponse } from '@/api/marketDataApi';

export {};

const ports: MessagePort[] = [];
const subscriptionPortsMap = new Map<string, MessagePort[]>();

self.onconnect = ({ ports: [port] }: MessageEvent) => {
    ports.push(port);

    port.onmessage = (m: MessageEvent) => {
        console.log(`ID: ${m.data}`);


    };
};

const MARKET_DATA_URL = 'ws://localhost:8090/market-data-ws';

const connectToWebSocket = () => {
     createWebSocket(
        MARKET_DATA_URL,
        message => listener(deserialiseMarketDataMessage(message)),
        () => {}
    );
}

