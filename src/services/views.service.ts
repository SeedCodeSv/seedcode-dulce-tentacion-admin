import axios from "axios";
import { API_URL } from "../utils/constants";
import { get_token } from "../storage/localStorage";
import { IGetViews } from "../types/view.types";
const token = get_token() ?? "";

export const get_views = () => {
  return axios.get<IGetViews>(API_URL + "/view", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
