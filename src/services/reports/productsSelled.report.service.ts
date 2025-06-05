import axios from "axios";

import { get_token } from "@/storage/localStorage";
import { IGetProductsSelled, IGetSummaryTotalProductsSelled, SearchReport } from "@/types/reports/productsSelled.report.types";

export const get_cuts_report = async (params: SearchReport) => {
  const token = get_token() ?? '';
  const url = import.meta.env.VITE_API_URL + `/reports/cash-cuts/${params.branchId}?page=${params.page}&limit=${params.limit}&startDate=${params.startDate}&endDate=${params.endDate}&productName=${params.productName}`;

  const response = await axios.get<IGetProductsSelled>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}


export const get_cuts_report_summary = async (params: SearchReport) => {
  const token = get_token() ?? '';
  const url = import.meta.env.VITE_API_URL + `/reports/cash-cuts-summary/${params.branchId}?page=${params.page}&limit=${params.limit}&startDate=${params.startDate}&endDate=${params.endDate}`;

  const response = await axios.get<IGetSummaryTotalProductsSelled>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}