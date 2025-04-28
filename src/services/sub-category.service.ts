import axios from "axios";

import { get_token } from "../storage/localStorage";
import { IGetSubCategory } from "../types/sub-category.types";
import { API_URL } from "../utils/constants";

export const get_subcategories = (id: number) => {
    const token = get_token();

    return axios.get<IGetSubCategory>(API_URL + `/sub-categories/by-category/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };