import axios from "axios";
import { IGetContractType } from "../types/contract_type.types";
import { API_URL } from "../utils/constants";
import { get_token } from "../storage/localStorage";

export const get_contract_types = async () => {
    const token = get_token();
    return await axios.get<IGetContractType>(`${API_URL}/contract-type`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}