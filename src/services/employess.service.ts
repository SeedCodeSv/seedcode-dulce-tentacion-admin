import axios from "axios";
import { API_URL } from "../utils/constants";
import {
  EmployeePayload,
  GetEmployeeList,
  IGetEmployeesPaginated,
} from "../types/employees.types";
import { get_token } from "../storage/localStorage";
const token = get_token() ?? "";

export const get_employees_paginated = (
  page: number,
  limit: number,
  fullName: string,
  branch: string,
  phone: string
) => {
  return axios.get<IGetEmployeesPaginated>(
    API_URL +
      "/employees/list-paginated?page=" +
      page +
      "&limit=" +
      limit +
      "&fullName=" +
      fullName +
      "&branch=" +
      branch +
      "&phone=" +
      phone,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const save_employee = (payload: EmployeePayload) => {
  return axios.post<{ ok: boolean }>(API_URL + "/employees", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patch_employee = (payload: EmployeePayload, id: number) => {
  return axios.patch<{ ok: boolean }>(API_URL + "/employees/" + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const delete_employee = (id: number) => {
  return axios.delete<{ ok: boolean }>(API_URL + "/employees/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_employee_list = () => {
  return axios.get<GetEmployeeList>(API_URL + "/employees", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
