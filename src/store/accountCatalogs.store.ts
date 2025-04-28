import { create } from 'zustand';
import { toast } from 'sonner';

import { accountCatalogsStore } from './types/accountCatalogs.store.types';

import {
  get_account_catalogs_paginated,
  get_catalog_by_id,
  post_account_catalog,
} from '@/services/accountCatalogs.service';
import { messages } from '@/utils/constants';
import { AccountCatalog } from '@/types/accountCatalogs.types';
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
  catalog_details: {} as AccountCatalog,
  getAccountCatalogs: (id, name, code) => {
    set({ loading: true });
    get_account_catalogs_paginated(id, name, code)
      .then((accountCatalogs) =>
        set({ account_catalog_pagination: accountCatalogs.data, loading: false })
      )
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

  getCatalogsDetails(id) {
    get_catalog_by_id(id)
      .then(({ data }) => {
        set({ catalog_details: data.accountCatalogs });
      })
      .catch(() => {
        set({ catalog_details: undefined });
      });
  },
}));
