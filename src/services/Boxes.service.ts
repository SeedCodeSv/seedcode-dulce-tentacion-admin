import axios from "axios";
import { API_URL } from "../utils/constants";
import { get_token } from "../storage/localStorage";
import { IGetBoxList, IBoxPayload, IGetBox, ICloseBox } from "../types/box.types";
import {formatDate} from "../utils/dates";
const token = get_token() ?? "";

export const get_boxes_List = async () => {
  return await axios.get<IGetBoxList>(`${API_URL}/box`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const save_box = async (payload: IBoxPayload) => {
  return await axios.post<IGetBox>(`${API_URL}/box`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export const verify_box = async (idBrach: number) => {
  return await axios.get<IGetBox>(`${API_URL}/box/verify-by-branch/${idBrach}?startDate=${formatDate()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
export const close_box = (closeBox: ICloseBox, idBox: number) => {
  return axios.post<IGetBox>(`${API_URL}/detail-box/save-detail/${idBox}`, closeBox, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}