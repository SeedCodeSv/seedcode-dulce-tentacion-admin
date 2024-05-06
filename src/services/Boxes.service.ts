import axios from "axios";
import { API_URL } from "../utils/constants";
import { get_token, get_user } from "../storage/localStorage";
import { IGetBoxList } from "../types/box.types";
const token = get_token() ?? "";

export const get_boxes_List = async () => {
  return await axios.get<IGetBoxList>(`${API_URL}/boxes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
