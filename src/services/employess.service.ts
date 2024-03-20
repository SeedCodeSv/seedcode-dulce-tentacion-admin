import axios from "axios";
import { API_URL } from "../utils/constants";
import {
  EmployeePayload,
  GetEmployeeList,
  IGetEmployeesPaginated,
} from "../types/employees.types";

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
      phone
  );
};

export const save_employee = (payload: EmployeePayload) => {
  return axios.post<{ ok: boolean }>(API_URL + "/employees", payload);
};

export const patch_employee = (payload: EmployeePayload, id: number) => {
  return axios.patch<{ ok: boolean }>(API_URL + "/employees/" + id, payload);
};

export const delete_employee = (id: number) => {
  return axios.delete<{ ok: boolean }>(API_URL + "/employees/" + id);
};

export const get_employee_list = ()=>{
  return axios.get<GetEmployeeList>(API_URL + "/employees")
}