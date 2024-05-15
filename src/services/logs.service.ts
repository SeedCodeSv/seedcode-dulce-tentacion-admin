import axios from "axios";
import { Logs } from "../types/logs.types";
import { API_URL } from "../utils/constants";

export const save_logs = (logs: Logs) => {
    return axios.post(`${API_URL}/logs`, logs)
}