import axios from "axios";

import { get_token } from "@/storage/localStorage";
import { IGetProductsSelled, IGetSummaryTotalProductsSelled, IGetTotalProductsSelledByBranches, SearchReport } from "@/types/reports/productsSelled.report.types";

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

  const queryParams = new URLSearchParams();

  if (params.branchIds && params.branchIds.length > 0) {
    params.branchIds.forEach(id => queryParams.append('branchIds', String(id)));
  }

  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.productName) queryParams.append('productName', params.productName);

  const url = `${import.meta.env.VITE_API_URL}/reports/products-selled-summary?${queryParams.toString()}`;

  const response = await axios.get<IGetSummaryTotalProductsSelled>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const get_products_selled_by_branches = async (params: SearchReport) => {
  const token = get_token() ?? '';

  const queryParams = new URLSearchParams();

  if (params.branchIds && params.branchIds.length > 0) {
    params.branchIds.forEach(id => queryParams.append('branchIds', String(id)));
  }

  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.productName) queryParams.append('productName', params.productName);

  const url = `${import.meta.env.VITE_API_URL}/reports/products-selled-by-branches?${queryParams.toString()}`;

  const response = await axios.get<IGetTotalProductsSelledByBranches>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

