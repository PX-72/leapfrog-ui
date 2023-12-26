import { subscribeToMarketData, unsubscribeFromMarketData } from '@/api/shared-worker/market-data/workerClient';

export const subscribe = (currencyPair: string) => subscribeToMarketData(currencyPair);
export const unsubscribe = (currencyPair: string) => unsubscribeFromMarketData(currencyPair);
