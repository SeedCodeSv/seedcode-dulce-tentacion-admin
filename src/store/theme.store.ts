import { create } from 'zustand';
import { ThemeStore } from './types/theme_store.types';
import { get_themes_paginated } from '../services/theme.service';
import { formatThemeData } from '../utils/filters';

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
  getPaginatedThemes: (page?: number) => {
    get_themes_paginated(page)
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
          themes: formatThemeData(data.themes),
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
