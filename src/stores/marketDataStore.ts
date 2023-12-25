import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { MarketData } from '@/api/types';
import { subscribe, unsubscribe } from '@/api/marketDataSubscriberApi';
// import * as notification from './components/common/notification.js';

type Subscription = {
    data?: MarketData,
    lastUpdated?: Date
};

type StatusInformation = {
    statusMessage: string,
    hasError: boolean,
    errorMessage?: string
};

type Store = {
    status: StatusInformation,
    subscriptions: {
        [currencyPair: string]: Subscription
    }
};

const initialState: Store = {
    status: {
        statusMessage: 'closed',
        hasError: false
    },
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
            if (!Object.hasOwn(get().subscriptions, currencyPair)){
                set(({ subscriptions }) => {
                    subscriptions[currencyPair] = {};
                });
                subscribe(currencyPair);
            }
        },
        removeSubscriptions: currencyPair => {
            if (Object.hasOwn(get().subscriptions, currencyPair)) {
                set(({ subscriptions }) => {
                    delete subscriptions[currencyPair];
                });
                unsubscribe(currencyPair);
            }
        }
    }))
);
