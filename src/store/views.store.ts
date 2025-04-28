import { create } from 'zustand';
import { AxiosError } from 'axios';

import { create_view, delete_views, get_actions_by_rol, get_views, get_views_list } from '../services/views.service';
import { views_enabled } from '../utils/constants';

import { ViewsStore } from './types/views.store.types';

import { IResponseDataViewasAction } from '@/types/view.types';

export const useViewsStore = create<ViewsStore>((set, get) => ({
  views_list: [],
  viewasAction: [],
  loading_views: false,
  views: [],
  founds: [],
  pagination_actions: {
    totalPag: 0,
    total: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
  },
  actions: [],
  OnGetActionsByRol(id) {
    get_actions_by_rol(id).then(({ data }) => {
      set({
        actions: data.views

      })
    })
  },
  OnGetViewasAction: async (
    page?: number,
    limit?: number,
    name?: string
  ): Promise<IResponseDataViewasAction> => {
    set({
      loading_views: true,
    });

    try {
      const { data } = await get_views_list(page || 1, limit || 10, name || '');

      set({
        viewasAction: data.viewasAction,
        pagination_actions: {
          total: data.total,
          totalPag: data.totalPag,
          currentPag: data.currentPag,
          nextPag: data.nextPag,
          prevPag: data.prevPag,
        },
        loading_views: false,
      });

      return {
        ok: true,
        totalPag: data.totalPag,
        total: data.total,
        currentPag: data.currentPag,
        nextPag: data.nextPag,
        prevPag: data.prevPag,
        viewasAction: data.viewasAction,
      };
    } catch (error) {
      set((state) => ({
        ...state,
        viewasAction: [],
        loading_views: false,
      }));

      // Proporcionar valores predeterminados en caso de error
      return {
        ok: false,
        message: 'Error => There are no views',
        status: 404,
        totalPag: 0,
        total: 0,
        currentPag: 0,
        nextPag: 0,
        prevPag: 0,
        viewasAction: [],
      };
    }
  },

  OnGetViews: async () => {
    await get_views()
      .then(({ data }) => {
        set({
          views: data.views,
        });
      })
      .catch(() => {
        set((state) => ({
          ...state,
          views: [],
        }));
      });
  },
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
