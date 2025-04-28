import axios from "axios";

import { get_token } from "../storage/localStorage";
import { API_URL } from "../utils/constants";
import { IExpensesData, ISalesByBranchData } from "../types/reports/reportByBrachTypes/reportByBranch.types";
export const get_report_expense_by_branch = async (id : number , startDate : string , endDate : string ) => {
  const token = get_token() ?? '';

  return await axios.get<IExpensesData>(
    `${API_URL}/reports/expenses-by-dates-branch/${id}?startDate=${startDate}&endDate=${endDate}}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
export const sales_by_dates_branch = async (id : number , startDate : string , endDate : string , ) => {
const token = get_token() ?? "";

return await axios.get<ISalesByBranchData>(
  `${API_URL}/reports/sales-by-dates-branch/${id}?startDate=${startDate}&endDate=${endDate}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
}