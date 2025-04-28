import { create } from 'zustand';
import { toast } from 'sonner';

import { TypeOfAccountStore } from './types/type-of-account.store.types';

import {
  create_type_of_account,
  delete_type_of_account,
  get_type_of_account_list,
  get_type_of_accounts,
  update_type_of_account,
} from '@/services/type-of-account.service';

export const useTypeOfAccountStore = create<TypeOfAccountStore>((set, get) => ({
  type_of_account: [],
  list_type_of_account: [],
  loading: false,
  type_of_account_pagination: {
    total: 0,
    currentPag: 1,
    nextPag: 1,
    prevPag: 1,
    totalPag: 1,
    ok: true,
    status: 200,
  },
  searchParams: {
    name: '',
    limit: 5,
    page: 1,
  },
  async getListTypeOfAccount (){
    return await get_type_of_account_list()
      .then((res) => {
        if (res.data.typeOfAccounts && res.data.typeOfAccounts.length > 0) {
          set((state) => ({
            ...state,
            list_type_of_account: res.data.typeOfAccounts ?? [],
          }));
        } else {
          set((state) => ({
            ...state,
            list_type_of_account: [],
          }));
        }
      })
      .catch(() => {
        set((state) => ({
          ...state,
          list_type_of_account: [],
        }));
      });
  },
  getTypeOfAccounts: (page: number, limit: number, name: string) => {
    set((state) => ({
      ...state,
      loading: true,
      searchParams: { name, limit, page },
    }));
    get_type_of_accounts(page, limit, name)
      .then((res) => {
        if (res.data.typeOfAccounts && res.data.typeOfAccounts.length > 0) {
          set((state) => ({
            ...state,
            type_of_account: res.data.typeOfAccounts,
            type_of_account_pagination: res.data,
            loading: false,
          }));
        } else {
          set((state) => ({
            ...state,
            type_of_account: [],
            type_of_account_pagination: {
              total: 0,
              currentPag: 1,
              nextPag: 1,
              prevPag: 1,
              totalPag: 1,
              ok: false,
              status: 400,
            },
            loading: false,
          }));
        }
      })
      .catch(() => {
        set((state) => ({
          ...state,
          type_of_account: [],
          type_of_account_pagination: {
            total: 0,
            currentPag: 1,
            nextPag: 1,
            prevPag: 1,
            totalPag: 1,
            ok: false,
            status: 400,
          },
          loading: false,
        }));
      });
  },
  createTypeOfAccount(payload) {
    return create_type_of_account(payload)
      .then(() => {
        toast.success('Tipo de Partida creado exitosamente');
        get().getTypeOfAccounts(1, get().searchParams.limit, '');

        return true;
      })
      .catch(() => {
        toast.error('Error al crear el tipo de partida');

        return false;
      });
  },
  updateTypeOfAccount(payload, id) {
    return update_type_of_account(id, payload)
      .then(() => {
        toast.success('Tipo de Partida actualizado exitosamente');
        get().getTypeOfAccounts(
          get().searchParams.page,
          get().searchParams.limit,
          get().searchParams.name
        );

        return true;
      })
      .catch(() => {
        toast.error('Error al actualizar el tipo de partida');

        return false;
      });
  },
  deleteTypeOfAccount(id) {
    return delete_type_of_account(id)
      .then(() => {
        toast.success('Tipo de Partida eliminado exitosamente');
        get().getTypeOfAccounts(1, get().searchParams.limit, '');

        return true;
      })
      .catch(() => {
        toast.error('Error al eliminar el tipo de partida');

        return false;
      });
  },
}));
