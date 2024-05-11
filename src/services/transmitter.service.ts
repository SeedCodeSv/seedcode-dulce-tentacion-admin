import axios from "axios";
import { API_URL, AUTH_MH } from "../utils/constants";
import { IGetTransmitter, ILoginMH } from "../types/transmitter.types";
import { get_token } from "../storage/localStorage";
import qs from "qs";
const token = get_token() ?? "";

export const get_transmitter = (id: number, token_send = "") => {
  return axios.get<IGetTransmitter>(API_URL + `/transmitter/${id}`, {
    headers: {
      Authorization: `Bearer ${token === "" || !token ? token_send : token}`,
    },
  });
};
export const login_mh = async (user: string, password: string) => {
  return axios.post<ILoginMH>(AUTH_MH, qs.stringify({ user, pwd: password }), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
