import axios from "axios";
import { API_URL } from "../utils/constants";
import { get_token } from "../storage/localStorage";
import { IActionPayload, IGetActionRol } from "../types/actions.types";
const token = get_token() ?? "";

export const save_action = (action: IActionPayload) => {
  return axios.post<IGetActionRol>(`${API_URL}/actions`, action, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
