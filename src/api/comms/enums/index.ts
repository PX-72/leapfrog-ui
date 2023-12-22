export enum EventTypeEnum {
    subscribeToMarketData = 'subscribeToMarketData',
    unsubscribeFromMarketData = 'unsubscribeFromMarketData',
    marketDataResponse = 'marketDataResponse',
    connectionStatusChange = 'connectionStatusChange',
    error = 'error',
    closePort = 'closePort'
}

export enum Status {
    Unknown = 'Unknown',
    Closed = 'Closed',
    Closing = 'Closing',
    Open = 'Open',
    Connecting = 'Connecting'
}