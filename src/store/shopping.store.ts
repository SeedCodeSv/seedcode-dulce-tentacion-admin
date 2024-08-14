import { create } from 'zustand';

import { IShoppingStore } from './types/shopping.store';
import { get_shoppings_paginated } from '@/services/shopping.service';

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
  getPaginatedShopping: (
    id,
    page = 1,
    limit = 5,
    fecha = '',
    segundaFecha = '',
    branchId = ''
  ): void => {
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
        });
      })
      .catch(() => {
        set({
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
}));
