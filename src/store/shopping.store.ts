import { create } from 'zustand';

import { IShoppingStore } from './types/shopping.store';
import {
  get_shopping_by_id,
  get_shopping_by_month,
  get_shoppings_paginated,
} from '@/services/shopping.service';
import { formatDate } from '@/utils/dates';

export const useShoppingStore = create<IShoppingStore>((set) => ({
  shoppingList: [],
  pagination_shopping: {
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 200,
    ok: true,
  },
  loading_shopping: false,
  shopping_details: undefined,
  shopping_by_months: [],
  search_params: {
    page: 1,
    limit: 10,
    startDate: formatDate(),
    endDate: formatDate(),
    branchId: '',
  },
  getPaginatedShopping: (
    id,
    page = 1,
    limit = 5,
    fecha = '',
    segundaFecha = '',
    branchId = ''
  ): void => {
    set({
      loading_shopping: true,
      search_params: {
        page,
        limit,
        startDate: fecha,
        endDate: segundaFecha,
        branchId,
      },
    });
    get_shoppings_paginated(id, page, limit, fecha, segundaFecha, branchId)
      .then(({ data }) => {
        set({
          shoppingList: data.compras,
          pagination_shopping: {
            total: data.total,
            totalPag: data.totalPag,
            currentPag: data.currentPag,
            nextPag: data.nextPag,
            prevPag: data.prevPag,
            status: data.status,
            ok: data.ok,
          },
          loading_shopping: false,
        });
      })
      .catch(() => {
        set({
          loading_shopping: false,
          shoppingList: [],
          pagination_shopping: {
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
  getShoppingDetails(id) {
    get_shopping_by_id(id)
      .then(({ data }) => {
        set({ shopping_details: data.compra });
      })
      .catch(() => {
        set({ shopping_details: undefined });
      });
  },
  onGetShoppingByMonth(transmitterId, month, year) {
    set({ loading_shopping: true });
    get_shopping_by_month(transmitterId, month, year)
      .then(({ data }) => {
        set({ shopping_by_months: data.shoppings, loading_shopping: false });
      })
      .catch(() => {
        set({ shopping_by_months: [], loading_shopping: false });
      });
  },
}));
