import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { getCurrencyPairs } from '@/api/staticDataApi';

type StaticDataStore = {
    currencyPairs: string[];
    loadCurrencyPairs: () => void;
};

export const useStaticDataStore = create<StaticDataStore, [['zustand/immer', never]]>(
    immer((set) => ({
        currencyPairs: [],
        loadCurrencyPairs: async () => {
            try {
                const currencyPairs = await getCurrencyPairs();
                set((state) => {
                    state.currencyPairs = currencyPairs ?? [];
                });
            } catch (err) {
                console.error(`Currency pairs static data could not be loaded. ${err}`);
            }
        }
    }))
);