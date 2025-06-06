import axios from "axios";

import { get_token } from "@/storage/localStorage";
import { IGetProductsSelled, IGetSummaryTotalProductsSelled, SearchReport } from "@/types/reports/productsSelled.report.types";

export const get_products_selled_by_dates = async (params: SearchReport) => {
  const token = get_token() ?? '';
  const url = import.meta.env.VITE_API_URL + `/reports/products-selled-by-dates/${params.branchId}?page=${params.page}&limit=${params.limit}&startDate=${params.startDate}&endDate=${params.endDate}&productName=${params.productName}`;

  const response = await axios.get<IGetProductsSelled>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}


export const get_products_selled_summary = async (params: SearchReport) => {
  const token = get_token() ?? '';
  const url = import.meta.env.VITE_API_URL + `/reports/products-selled-summary/${params.branchId}?page=${params.page}&limit=${params.limit}&startDate=${params.startDate}&endDate=${params.endDate}&productName=${params.productName}`;

  const response = await axios.get<IGetSummaryTotalProductsSelled>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}