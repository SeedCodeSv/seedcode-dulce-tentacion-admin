import { create } from 'zustand';
import { accountCatalogsStore } from './types/accountCatalogs.store.types';
import { get_account_catalogs_paginated, post_account_catalog } from '@/services/accountCatalogs.service';
import { messages } from '@/utils/constants';
import { toast } from 'sonner';
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
    getAccountCatalogs: (name, code) => {
        set({ loading: true });
        get_account_catalogs_paginated(name, code)
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

    postAccountCatalog(payload) {
        return post_account_catalog(payload)
            .then(({ data }) => {
                toast.success(messages.success);
                return data.ok;
            })
            .catch(() => {
                toast.warning(messages.error);
                return false;
            });
    },

}));
