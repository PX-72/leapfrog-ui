import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
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
    status: 'unknown' | 'healthy' | 'error'
};

type Store = {
    status: StatusInformation,
    errorNotification: {
        error: string,
        hasError: boolean
    },
    subscriptions: {
        [currencyPair: string]: Subscription
    }
};

const initialState: Store = {
    status: {
        statusMessage: 'closed',
        status: 'unknown'
    },
    errorNotification: {
        error: '',
        hasError: false
    },
    subscriptions: {}
};

type Actions = {
    addSubscriptions: (currencyPair: string) => void,
    removeSubscriptions: (currencyPair: string) => void,
    consumeNewMarketDataUpdate: (marketData: MarketData) => void
    consumeError: (error: string) => void
};

export const useMarketDataStore = create<Store & Actions, [['zustand/immer', never], ['zustand/devtools', never]]>(
    immer(devtools((set, get) => ({
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
        },
        consumeNewMarketDataUpdate: (marketData: MarketData) => {
            if (!marketData || !Object.hasOwn(get().subscriptions, marketData.ccyPair)) return;

            set(({ subscriptions }) => {
                subscriptions[marketData.ccyPair] = { data: marketData, lastUpdated: new Date() };
            });
        },
        consumeError: (error: string) => {
            set(({ errorNotification }) => {
                errorNotification.error = error;
                errorNotification.hasError = true;
            });
        }
    }), { enabled: process.env.NODE_ENV !== 'production' }))
);
