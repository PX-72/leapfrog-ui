export interface MarketDataRequestConfiguration {
    configurationId: string;
    size: number;
    intervalInMillis: number;
    intervalDelayInMillis: number;
    ccyFilter: string[];
}

export const sendRequest = async (data: MarketDataRequestConfiguration): Promise<boolean> => {
    const response = await fetch('http://localhost:8070/api/v1/market-data/data-request', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data), 
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.ok;
}