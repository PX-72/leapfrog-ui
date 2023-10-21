import { sendRequest, MarketDataRequestConfiguration } from '@/api/marketDataApi.js';
import { DefaultButton } from '@/components/common/styles.js';

const requestToSend: MarketDataRequestConfiguration = {
    configurationId: '83Y4384Y',
    size: 10,
    intervalInMillis: 1000,
    intervalDelayInMillis: 200,
    ccyFilter: ['USDEUR', 'GBPUSD'], 
};

export const MarketDataRequest = () => {

    return (
        <DefaultButton onClick={() => sendRequest({
                configurationId: '83Y4384Y',
                size: 10,
                intervalInMillis: 1000,
                intervalDelayInMillis: 200,
                ccyFilter: ['USDEUR', 'GBPUSD'], 
            })}
        >Send market data request</DefaultButton>
    );

};