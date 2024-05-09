import axios from "axios";
import { API_URL } from "../utils/constants";
import { get_token } from "../storage/localStorage";
import {IGetActionRolList} from "../types/actions_rol.types";
const token = get_token() ?? "";

export const get_actions_by_rol_and_view = (rolId: number, viewId: number) => {
  return axios.get<IGetActionRolList>(
    `${API_URL}/role-actions/by-rol-and-view/${rolId}/${viewId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
