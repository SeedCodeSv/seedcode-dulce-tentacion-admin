import axios from "axios";
import { API_URL } from "../utils/constants";
import {
  IGetCustomerPagination,
  PayloadCustomer,
} from "../types/customers.types";

export const get_customers_pagination = (
  page = 1,
  limit = 5,
  name = "",
  email = ""
) => {
  return axios.get<IGetCustomerPagination>(
    API_URL +
      "/customers/list-paginated?page=" +
      page +
      "&limit=" +
      limit +
      "&nombre=" +
      name +
      "&correo=" +
      email
  );
};

export const save_customers = (payload: PayloadCustomer) => {
  return axios.post<{ ok: boolean }>(API_URL + "/customers", payload);
};

export const update_customers = (payload: PayloadCustomer, id: number) => {
  return axios.patch<{ ok: boolean }>(API_URL + "/customers/" + id, payload);
};

export const delete_customer = (id: number) => {
  return axios.delete<{ ok: boolean }>(API_URL + "/customers/" + id);
};
