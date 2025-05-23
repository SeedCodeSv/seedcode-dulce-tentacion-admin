import { create } from 'zustand';
import { toast } from 'sonner';

import {
  activate_user,
  delete_user,
  generate_code,
  get_user_paginated,
  get_users_list,
  patch_password,
  patch_user,
  save_user,
} from '../services/users.service';
import { messages } from '../utils/constants';

import { UsersStore } from './types/users_store.types';


export const useUsersStore = create<UsersStore>((set) => ({
  users: [],
  users_paginated: {
    users: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  active_filter: 1,
  loading_users: false,
  async getUsersPaginated(transmitter, page, limit, userName, role, active = 1) {
    set({ active_filter: active, loading_users: true });
    await get_user_paginated(transmitter, page, limit, userName, role, active)
      .then(({ data }) => {
        set((state) => ({ ...state, users_paginated: data, loading_users: false }));
      })
      .catch(() => {
        set({
          loading_users: false,
          users_paginated: {
            users: [],
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

  saveUsers(users) {
    set({ users });
  },
  getUsers() {
    get_users_list().then(({ data }) => {
      set((state) => ({ ...state, users: data.users }));
    });
  },
  postUser(payload) {
    return save_user(payload)
      .then(({ data }) => {
        toast.success(messages.success);

        return data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);

        return false;
      });
  },
  patchUser(payload, id) {
    return patch_user(payload, id)
      .then((res) => {
        toast.success(messages.success);

        return res.data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);

        return false;
      });
  },
  deleteUser(id) {
    return delete_user(id)
      .then(({ data }) => {
        toast.success(messages.success);

        return data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);

        return false;
      });
  },
  async updatePassword(id, password) {
    return await patch_password(password, id)
      .then((data) => {
        toast.success(messages.success);

        return data.data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);

        return false;
      });
  },

  activateUser(id) {
    return activate_user(id)
      .then(() => {
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  async generateCode(id) {
    try {
      const data = await generate_code(id);

      if (data && data.data.ok) {
        toast.success(messages.success);

        return data.data.code;
      } else {
        toast.warning(messages.error);

        return null;
      }
    } catch (error) {
      toast.warning(messages.error);

      return null;
    }
  }
  
}));
