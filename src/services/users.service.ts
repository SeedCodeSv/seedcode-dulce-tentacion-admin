import axios from "axios";
import { API_URL } from "../utils/constants";
import { IGetUsers, UserPayload } from "../types/users.types";

export const get_users_list = () => {
  return axios.get<IGetUsers>(API_URL + "/users");
};

export const save_user = (payload: UserPayload) => {
  return axios.post<{ ok: boolean }>(API_URL + "/users", payload);
};

export const patch_user = (payload: UserPayload, id: number) => {
  return axios.patch<{ ok: boolean }>(API_URL + "/users/" + id, payload);
};

export const delete_user = (id: number) => {
  return axios.delete<{ ok: boolean }>(API_URL + "/users/" + id);
};

export const patch_password = (password: string, id: number) => {
  return axios.patch<{ ok: boolean }>(
    API_URL + "/employees/change-password/" + id,
    {
      password,
    }
  );
};