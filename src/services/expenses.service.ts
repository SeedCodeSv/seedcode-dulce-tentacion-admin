import axios from "axios";
import { IExpensePayload, IExpensesPaginated } from "../types/expenses.types";
import { API_URL } from "../utils/constants";
import { get_token } from "../storage/localStorage";

export const get_expenses_paginated = (
  idBox = 0,
  page = 1,
  limit = 5,
  category = ""
) => {
  const token = get_token() ?? "";
  // const user = get_user();
  return axios.get<IExpensesPaginated>(
    API_URL +
      `/expenses/list-paginated/${idBox}?page=${page}&limit=${limit}&category=${category}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const save_expenses = (payload: IExpensePayload) => {
  const token = get_token() ?? "";
  return axios.post<{ ok: boolean }>(API_URL + "/expenses", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const patch_expenses = (id: number, payload: IExpensePayload) => {
  const token = get_token() ?? "";
  return axios.patch<{ ok: boolean }>(API_URL + "/expenses/" + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const delete_expenses = (id: number) => {
  const token = get_token() ?? "";
  return axios.delete<{ ok: boolean }>(API_URL + "/expenses/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
