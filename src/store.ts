import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import * as notification from './components/common/notification.js';

type Store = {
  
};

export const useStore = create<Store, [['zustand/immer', never]]>(
  immer((set) => ({
    

  }))
);
