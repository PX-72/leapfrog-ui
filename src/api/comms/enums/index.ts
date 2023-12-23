export enum EventType {
    SubscribeToMarketData = 'SubscribeToMarketData',
    UnsubscribeFromMarketData = 'UnsubscribeFromMarketData',
    MarketDataResponse = 'MarketDataResponse',
    ConnectionStatusChange = 'ConnectionStatusChange',
    Error = 'Error',
    ClosePort = 'ClosePort'
}

export enum Status {
    Unknown = 'Unknown',
    Closed = 'Closed',
    Closing = 'Closing',
    Ready = 'Ready',
    Connecting = 'Connecting'
}