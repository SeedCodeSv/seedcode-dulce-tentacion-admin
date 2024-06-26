import axios from "axios";
import { get_token } from "../storage/localStorage";
import { IGetEmployeeStatus } from "../types/employee_status.types";
import { API_URL } from "../utils/constants";

export const get_employee_status = async () => {
    const token = get_token();
    return await axios.get<IGetEmployeeStatus>(API_URL + `/employee-status`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}