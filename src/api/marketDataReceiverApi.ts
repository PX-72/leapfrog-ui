import { marketDataListener, errorListener } from '@/api/shared-worker/market-data/workerClient';
import { useMarketDataStore } from '@/stores/marketDataStore';

let subscriptionHasStarted = false;

export const startMarketDataSubscription = () => {
    if (subscriptionHasStarted) return; // todo

    const updateFn = useMarketDataStore.getState().consumeNewMarketDataUpdate;
    marketDataListener.add(updateFn);

    const errorFn = useMarketDataStore.getState().consumeError;
    errorListener.add(errorFn);

    return () => {
        marketDataListener.remove(updateFn);
        errorListener.remove(errorFn);
    };
};