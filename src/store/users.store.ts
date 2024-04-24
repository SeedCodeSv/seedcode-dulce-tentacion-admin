import { create } from "zustand";
import { UsersStore } from "./types/users_store.types";
import {
  delete_user,
  get_user_paginated,
  get_users_list,
  patch_password,
  patch_user,
  save_user,
} from "../services/users.service";
import { messages } from "../utils/constants";
import { toast } from "sonner";

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
  async getUsersPaginated(id, page, limit, userName) {
    get_user_paginated(id, page, limit, userName).then(({ data }) => {
      set((state) => ({ ...state, users_paginated: data }));
    }).catch(() => {
      set({
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
        get().getUsers();
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
        get().getUsers();
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
        get().getUsers();
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
}));
