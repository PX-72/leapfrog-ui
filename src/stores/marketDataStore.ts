import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
//import * as notification from './components/common/notification.js';

type MarketDataStore = {
    currencyPairSubscriptions: string[],
    addCurrencyPairSubscriptions: (currencyPair: string) => void,
    removeCurrencyPairSubscriptions: (currencyPair: string) => void
};

export const useStore = create<MarketDataStore, [['zustand/immer', never]]>(
    immer((set) => ({
        currencyPairSubscriptions: [],
        addCurrencyPairSubscriptions: currencyPair => {

        },
        removeCurrencyPairSubscriptions: currencyPair => {

        }
    }))
);
