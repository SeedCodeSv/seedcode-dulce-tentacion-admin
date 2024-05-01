import axios from "axios";
import { IGetProductsPaginated, ProductPayload } from "../types/products.types";
import { API_URL } from "../utils/constants";
import { get_token, get_user } from "../storage/localStorage";
const token = get_token() ?? "";

export const get_products = (page = 1, limit = 5, category = "", name = "") => {
  const user = get_user();
  return axios.get<IGetProductsPaginated>(
    API_URL +
    `/products/list-paginated/${user?.employee.branch.transmitterId}?page=${page}&limit=${limit}&category=${category}&name=${name}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const create_products = (values: ProductPayload) => {
  return axios.post<{ ok: boolean }>(API_URL + "/products", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const update_products = (values: ProductPayload, id: number) => {
  return axios.patch<{ ok: boolean }>(API_URL + "/products/" + id, values,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const delete_products = (id: number) => {
  return axios.delete<{ ok: boolean }>(API_URL + "/products/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
