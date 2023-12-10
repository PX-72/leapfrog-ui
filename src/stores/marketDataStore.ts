import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { MarketData } from '@/api/types';
// import * as notification from './components/common/notification.js';

type Subscription = {
    data?: MarketData,
    lastUpdated?: Date,
    error?: string
};

type Store = {
    subscriptions: {
        [currencyPair: string]: Subscription
    }
};

const initialState: Store = {
    subscriptions: {}
};

type Actions = {
    addSubscriptions: (currencyPair: string) => void,
    removeSubscriptions: (currencyPair: string) => void
};

export const useMarketDataStore = create<Store & Actions, [['zustand/immer', never]]>(
    immer((set, get) => ({
        ...initialState,
        addSubscriptions: currencyPair => {
            if (!Object.hasOwn(get().subscriptions, currencyPair))
                set(({ subscriptions }) => {
                    subscriptions[currencyPair] = {};
                });
        },
        removeSubscriptions: currencyPair => {
            set(({ subscriptions }) => delete subscriptions[currencyPair]);
        }
    }))
);
