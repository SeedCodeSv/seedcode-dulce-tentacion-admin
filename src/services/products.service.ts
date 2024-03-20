import axios from "axios";
import { IGetProductsPaginated, ProductPayload } from "../types/products.types";
import { API_URL } from "../utils/constants";

export const get_products = (
  page = 11,
  limit = 5,
  category = "",
  name = ""
) => {
  return axios.get<IGetProductsPaginated>(
    API_URL +
      `/products/list-paginated/?page=${page}&limit=${limit}&category=${category}&name=${name}`
  );
};

export const create_products = (values: ProductPayload) => {
  return axios.post<{ ok: boolean }>(API_URL + "/products", values);
};

export const update_products = (values: ProductPayload, id: number) => {
  return axios.patch<{ ok: boolean }>(API_URL + "/products/" + id, values);
};
