import { create } from 'zustand';
import { toast } from 'sonner';

import { delete_theme, get_theme_find_one, get_themes_paginated } from '../services/theme.service';

import { ThemeStore } from './types/theme_store.types';

import { get_theme_by_transmitter } from '@/services/configuration.service';
import { Personalization } from '@/types/configuration.types';
import { messages } from '@/utils/constants';

export const useThemeStore = create<ThemeStore>((set, get) => ({
  themes: [],
  findOne: {
    themes: [],
    message: '',
    status: 404,
    ok: false,
  },
  pagination_themes: {
    themes: [],
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
          pagination_themes: data,
          themes: data.themes,
        });
      })
      .catch(() => {
        set({
          themes: [],
          pagination_themes: {
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
  GetTemeByTransmiter() {
    get_theme_by_transmitter()
      .then(({ data }) => {
        set((state) => ({ ...state, config: data.personalization }));
      })
      .catch(() => {
        set((state) => ({ ...state, config: {} as Personalization }));
      });
  },
  deleteTheme(id) {
    return delete_theme(id)
      .then(({ data }) => {
        get().getPaginatedThemes(1, 5);
        toast.success(messages.success);

        return data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);

        return false;
      });
  },
  getThemefindOne: (id: number) => {
    get_theme_find_one(id)
      .then(({ data }) => {
        set({
          findOne: {
            status: data.status,
            themes: data.themes,
            message: data.message,
            ok: data.ok,
          },
        });
      })
      .catch(() => {
        set({
          findOne: {
            themes: [],
            message: '',
            status: 404,
            ok: false,
          },
        });
      });
  },
}));
