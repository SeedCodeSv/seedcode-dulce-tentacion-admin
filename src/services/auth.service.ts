import axios from "axios";
import { IAuthPayload, IAuthResponse } from "../types/auth.types";
import { API_URL } from "../utils/constants";

export const post_login = (payload: IAuthPayload) => {

    return axios.post<IAuthResponse>(API_URL + "/auth", payload);
}