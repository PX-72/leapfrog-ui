import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { getCurrencyPairs } from '@/api/staticDataApi';

type Store = {
    currencyPairs: string[];
};

const initialState: Store = {
    currencyPairs: []
};

type Actions = {
    loadCurrencyPairs: () => void;
};

export const useStaticDataStore = create<Store & Actions, [['zustand/immer', never]]>(
    immer((set) => ({
        ...initialState,
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