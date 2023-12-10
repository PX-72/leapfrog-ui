import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { getCurrencyPairs } from '@/api/staticDataApi';

type Store = {
    currencyPairs: string[],
    defaultCurrencyPair: string
};

const initialState: Store = {
    currencyPairs: [],
    defaultCurrencyPair: ''
};

type Actions = {
    loadCurrencyPairs: () => void
};

export const useStaticDataStore = create<Store & Actions, [['zustand/immer', never]]>(
    immer((set) => ({
        ...initialState,
        loadCurrencyPairs: async () => {
            try {
                const currencyPairs = await getCurrencyPairs();
                set((state) => {
                    const list = currencyPairs ?? [];
                    state.currencyPairs = list;
                    if (list.length > 0) state.defaultCurrencyPair = list[0];
                });
            } catch (err) {
                console.error(`Currency pairs static data could not be loaded. ${err}`);
            }
        }
    }))
);
