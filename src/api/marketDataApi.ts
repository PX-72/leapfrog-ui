import { createWebSocket } from '@/api/comms/webSocketWrapper';

export type MarketDataRequestConfiguration = {
    configurationId: string;
    size: number;
    intervalInMillis: number;
    initialDelayInMillis: number;
    ccyFilter: string[];
};

export type MarketDataResponse = {
    ccyPair: string;
    bid: number;
    offer: number;
    low: number;
    high: number;
    ecn: string;
};

export const sendRequest = async (data: MarketDataRequestConfiguration): Promise<boolean> => {
    const response = await fetch('http://localhost:8090/api/v1/market-data/data-request', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.ok;
};

const MARKET_DATA_URL = 'ws://localhost:8090/market-data-ws';

const deserialiseMarketDataMessage = (message: MessageEvent): MarketDataResponse => JSON.parse(message.data) as MarketDataResponse;

export const subscribeToMarketData = (listener: (data: MarketDataResponse) => void) => createWebSocket(
    MARKET_DATA_URL,
    message => listener(deserialiseMarketDataMessage(message)),
    () => {}
).close;
