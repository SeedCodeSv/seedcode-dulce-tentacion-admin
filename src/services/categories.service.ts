import axios from "axios";
import {
  IGetCategories,
  IGetCategoriesPaginated,
} from "../types/categories.types";
import { API_URL } from "../utils/constants";
import { get_token, get_user } from "../storage/localStorage";
const token = get_token() ?? "";

export const get_products_categories = (page = 1, limit = 8, name = "") => {
  const user = get_user();
  return axios.get<IGetCategoriesPaginated>(
    API_URL +
      `/category-products/list-paginated/${user?.employee.branch.transmitterId}?page=${page}&limit=${limit}&name=${name}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const create_category = ({ name }: { name: string }) => {
  const user = get_user();
  return axios.post<{ ok: boolean }>(
    API_URL + "/category-products",
    {
      name,
      transmitterId: user!.transmitterId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const update_category = ({ name }: { name: string }, id: number) => {
  return axios.patch<{ ok: boolean }>(
    API_URL + "/category-products/" + id,
    {
      name,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const get_categories = () => {
  const user = get_user();
  return axios.get<IGetCategories>(API_URL + `/category-products/list-by-transmitter/${user?.employee.branch.transmitterId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
