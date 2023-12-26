import { Status } from '@/api/ws/Status';
import { MarketData } from '@/api/types';

export const enum PortEventType {
    SubscribeToMarketData = 'SubscribeToMarketData',
    UnsubscribeFromMarketData = 'UnsubscribeFromMarketData',
    MarketDataResponse = 'MarketDataResponse',
    ConnectionStatusChange = 'ConnectionStatusChange',
    Error = 'Error',
    Log = 'Log',
    ClosePort = 'ClosePort'
}

export type StatusPayload = {
    status: Status
};

export type CurrencyPairPayload = {
    currencyPair: string
};

export type ErrorPayload = {
    error: string
};

export type LogType = 'debug' | 'error';

export type LogPayload = {
    logType: LogType,
    message: string
};

export type PortPayload = {
    type: PortEventType,
    payload?: StatusPayload | CurrencyPairPayload | ErrorPayload | LogPayload | MarketData | string
};