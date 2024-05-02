import axios from "axios";
import { API_URL } from "../utils/constants";
import {
  IGetUserPaginated,
  IGetUsers,
  UserPayload,
} from "../types/users.types";
import { get_token, get_user } from "../storage/localStorage";
const token = get_token() ?? "";

export const get_users_list = () => {
  return axios.get<IGetUsers>(API_URL + "/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_user_paginated = (
  page = 1,
  limit = 5,
  userName = ""
) => {
  const user = get_user();
  return axios.get<IGetUserPaginated>(
    API_URL +
      "/users/paginated/" +
      user?.employee.branch.transmitterId +
      `?page=${page}&limit=${limit}&userName=${userName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const save_user = (payload: UserPayload) => {
  return axios.post<{ ok: boolean }>(API_URL + "/users", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patch_user = (payload: UserPayload, id: number) => {
  return axios.patch<{ ok: boolean }>(API_URL + "/users/" + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const delete_user = (id: number) => {
  return axios.delete<{ ok: boolean }>(API_URL + "/users/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patch_password = (password: string, id: number) => {
  return axios.patch<{ ok: boolean }>(
    API_URL + "/employees/change-password/" + id,
    {
      password,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
