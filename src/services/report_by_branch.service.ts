import axios from "axios";
import { get_token } from "../storage/localStorage";
import { API_URL } from "../utils/constants";
import { IExpensesData } from "../types/reports/reportByBrachTypes/reportByBranch.types";

export const get_report_by_branch = async () => {
  const token = get_token() ?? '';
  return await axios.get<IExpensesData>(`${API_URL}/report/branch`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}