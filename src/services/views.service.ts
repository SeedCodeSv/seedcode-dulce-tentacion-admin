import axios from "axios";
import { API_URL } from "../utils/constants";
import { get_token } from "../storage/localStorage";
import { IGetViews, IViewPayload } from "../types/view.types";

export const get_views = () => {
  const token = get_token() ?? "";
  return axios.get<IGetViews>(API_URL + "/view", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const create_view = (views: IViewPayload) => {
  return axios.post<IGetViews>(API_URL + `/view`, {
    ...views,
    type: "Drawer"
  }
)
};

export const delete_views = async (id: number) => {
  return await axios.delete<IGetViews>(API_URL + `/view/${id}`)
};
