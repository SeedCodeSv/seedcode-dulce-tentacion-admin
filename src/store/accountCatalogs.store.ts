import { create } from 'zustand';
import { accountCatalogsStore } from './types/accountCatalogs.store.types';
import { get_account_catalogs_paginated } from '@/services/accountCatalogs.service';
export const useAccountCatalogsStore = create<accountCatalogsStore>((set) => ({
    account_catalog: [],
    loading: false,
    account_catalog_pagination: {
        accountCatalogs: [],
        total: 0,
        totalPag: 0,
        currentPag: 0,
        nextPag: 0,
        prevPag: 0,
        status: 0,
        ok: false,
    },

    getAccountCatalogs: (page, limit) => {
        set({ loading: true });
        get_account_catalogs_paginated(page, limit)
            .then((accountCatalogs) => set({ account_catalog_pagination: accountCatalogs.data, loading: false }))
            .catch(() => {
                set({
                    loading: false,
                    account_catalog_pagination: {
                        accountCatalogs: [],
                        total: 0,
                        totalPag: 0,
                        currentPag: 0,
                        nextPag: 0,
                        prevPag: 0,
                        status: 404,
                        ok: false,
                    },
                });
            });
    },

}));
