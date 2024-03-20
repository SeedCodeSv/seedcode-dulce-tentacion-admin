import { create } from "zustand";
import { UsersStore } from "./types/users_store.types";
import {
  delete_user,
  get_users_list,
  patch_password,
  patch_user,
  save_user,
} from "../services/users.service";
import { messages } from "../utils/constants";
import { toast } from "sonner";

export const useUsersStore = create<UsersStore>((set, get) => ({
  users: [],
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
