import { sendRequest } from '@/api/marketDataApi.js';
import { DefaultButton } from '@/components/common/styles.js';

export const MarketDataRequest = () => (
    <DefaultButton onClick={
        () => sendRequest({
            configurationId: '83Y4384Y',
            size: 10,
            intervalInMillis: 1000,
            initialDelayInMillis: 200,
            ccyFilter: ['USDEUR', 'GBPUSD']
        })
    }>Send market data request</DefaultButton>
);
