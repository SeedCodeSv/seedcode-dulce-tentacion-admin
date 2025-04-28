import { create } from 'zustand';

import { get_themes_paginated } from '../services/theme.service';

import { ThemeStore } from './types/theme_store.types';

export const useThemeStore = create<ThemeStore>((set) => ({
  themes: [],
  paginatiom_themes: {
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  getPaginatedThemes: (page?: number, limit?: number) => {
    get_themes_paginated(page, limit)
      .then(({ data }) => {
        set({
          paginatiom_themes: {
            total: data.total,
            totalPag: data.totalPag,
            currentPag: data.currentPag,
            nextPag: data.nextPag,
            prevPag: data.prevPag,
            status: data.status,
            ok: data.ok,
          },
          themes: [],
        });
      })
      .catch(() => {
        set({
          themes: [],
          paginatiom_themes: {
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
  postTheme: () => {},
}));
