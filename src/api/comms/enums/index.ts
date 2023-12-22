export enum EventTypeEnum {
    subscribeToMarketData = 'subscribeToMarketData',
    unsubscribeFromMarketData = 'unsubscribeFromMarketData',
    marketDataResponse = 'marketDataResponse',
    connectionStatusChange = 'connectionStatusChange',
    error = 'error'
}

export enum Status {
    Closed = 'Closed',
    Ready = 'Ready',
    Connecting = 'Connecting',
}