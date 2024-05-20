import axios from "axios";
import { API_URL } from "../utils/constants";
import { get_token } from "../storage/localStorage";
import { IInvalidationResponse } from "../types/DTE/invalidation.types";
import { IGetSales } from "../types/sales.types";

export const post_sales = (
  pdf: string,
  dte: string,
  cajaId: number,
  codigoEmpleado: string,
  sello: string
) => {
  const token = get_token() ?? "";
  return axios.post(
    API_URL + "/sales/factura-sale",
    { pdf, dte, cajaId, codigoEmpleado, sello },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const invalidate_sale = (id: number, selloInvalidacion: string) => {
  const token = get_token();
  return axios.patch<IInvalidationResponse>(
    API_URL + `/sales/invalidate/${id}`,
    { selloInvalidacion },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const get_json_sale = (id: number) => {
  const token = get_token();
  return axios.get<{ ok: boolean, json: string, status: number }>(API_URL + `/sales/get-json/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const update_seal_sale = (pdf: string, dte: string, sello: string) => {
  const token = get_token();
  return axios.put(
    API_URL + "/sales/sale-update-transaction",
    { pdf, dte, sello },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export const get_sales_by_status = (
  id: number,
  page: number,
  limit: number,
  startDate: string,
  endDate: string,
  status: number
) => {
  return axios.get<IGetSales>(
    API_URL +
    `/sales/get-contigencia/${id}?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&status=${status}`
  );
};
