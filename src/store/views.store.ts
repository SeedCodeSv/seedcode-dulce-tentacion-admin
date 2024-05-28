import { ViewsStore } from './types/views.store.types';
import { create } from 'zustand';
import { create_view, delete_views, get_views } from '../services/views.service';
import { views_enabled } from '../utils/constants';
import { AxiosError } from 'axios';

export const useViewsStore = create<ViewsStore>((set, get) => ({
  views_list: [],
  founds: [],
  getViews: async () => {
    await get_views()
      .then(({ data }) => {
        const enabled = views_enabled.filter((route) => {
          return !data.views.map((route) => route.name).includes(route);
        });
        set((state) => ({
          ...state,
          views_list: data.views,
          founds: enabled,
        }));
      })
      .catch(() => {
        set((state) => ({
          ...state,
          views_list: [],
        }));
      });
  },

  OnCreateView(views) {
    const promises = views.map((value) => {
      create_view(value)
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    });

    return Promise.all(promises)
      .then(() => {
        get().getViews();
        return true;
      })
      .catch(() => {
        return false;
      });
  },

  OnDeleteView(id: number) {
    const value = delete_views(id)
      .then((response) => {
        return response.data.ok;
      })
      .catch((error: AxiosError<{ status: number }>) => {
        alert(Number(error.response?.data.status));
        return false;
      });
    return value;
  },
}));
