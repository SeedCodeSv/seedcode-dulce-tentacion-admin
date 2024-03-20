import axios from "axios";
import { API_URL } from "../utils/constants";
import { IGetRoleList } from "../types/roles.types";

export const get_all_roles = () => {
  return axios.get<IGetRoleList>(API_URL + "/roles");
};
