export const enum EventType {
    SubscribeToMarketData = 'SubscribeToMarketData',
    UnsubscribeFromMarketData = 'UnsubscribeFromMarketData',
    MarketDataResponse = 'MarketDataResponse',
    ConnectionStatusChange = 'ConnectionStatusChange',
    Error = 'Error',
    ClosePort = 'ClosePort'
}

export const enum ServerEventType {
    SUBSCRIBE_TO_MARKET_DATA = 'SUBSCRIBE_TO_MARKET_DATA',
    UNSUBSCRIBE_FROM_MARKET_DATA = 'UNSUBSCRIBE_FROM_MARKET_DATA',
    MARKET_DATA_RESPONSE = 'MARKET_DATA_RESPONSE'
}

export const enum Status {
    Unknown = 'Unknown',
    Closed = 'Closed',
    Closing = 'Closing',
    Ready = 'Ready',
    Connecting = 'Connecting'
}