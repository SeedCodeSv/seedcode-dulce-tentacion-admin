import axios from "axios";
import { API_URL } from "../utils/constants";
import { get_token } from "../storage/localStorage";
import { ExpensePayload, IGetExpensesPaginated } from "../types/categories_expenses.types";

const token = get_token() ?? "";

export const save_categories_expenses = (payload: ExpensePayload) => {
  return axios.post<{ ok: boolean }>(API_URL + "/category-expenses", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const get_categories_expenses_paginated = (page: number, limit: number, name: string) => {
return axios.get<IGetExpensesPaginated>(API_URL + `/category-expenses/paginated`)
}