import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
//import * as notification from './components/common/notification.js';

type MarketDataStore = {

};

export const useStore = create<MarketDataStore, [['zustand/immer', never]]>(
    immer((set) => ({


    }))
);
