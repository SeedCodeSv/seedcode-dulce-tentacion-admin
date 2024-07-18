import { create } from 'zustand';
import { UsersStore } from './types/users_store.types';
import {
  activate_user,
  delete_user,
  get_user_paginated,
  get_users_list,
  patch_password,
  patch_user,
  save_user,
} from '../services/users.service';
import { messages } from '../utils/constants';
import { toast } from 'sonner';

export const useUsersStore = create<UsersStore>((set, get) => ({
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
  async getUsersPaginated(page, limit, userName, role, active = 1) {
    set({ active_filter: active, loading_users: true });
    await get_user_paginated(page, limit, userName, role, active)
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
        get().getUsersPaginated(1, 5, '', '', get().active_filter);
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
        get().getUsersPaginated(1, 5, '', '', get().active_filter);
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
        get().getUsersPaginated(1, 5, '', '', get().active_filter);
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
}));
