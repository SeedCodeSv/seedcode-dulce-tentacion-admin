import axios from 'axios';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';
import { IInvalidationResponse } from '../types/DTE/invalidation.types';
import { IGetSaleDetails, IGetSales } from '../types/sales.types';
import {
  IGetSaleByProduct,
  IGraphicForCategoryProductsForDates,
  IGraphicSubCategoryProductsForDates,
} from '@/types/reports/sales.reports.types';
import { IGetSalesCCF } from '@/types/sales_cff.types';
import { IGetFacturasByMonth } from '@/types/factura.types';

export const post_sales = (
  pdf: string,
  dte: string,
  cajaId: number,
  codigoEmpleado: string,
  sello: string
) => {
  const token = get_token() ?? '';
  return axios.post(
    API_URL + '/sales/factura-sale',
    { pdf, dte, cajaId, codigoEmpleado, sello },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const post_sales_with_credit = (
  pdf: string,
  dte: string,
  cajaId: number,
  codigoEmpleado: string,
  sello: string,
  creditId: number
) => {
  const token = get_token() ?? '';
  return axios.post(
    API_URL + '/sales/credit-sale',
    { pdf, dte, cajaId, codigoEmpleado, sello, creditId },
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
  return axios.get<{ ok: boolean; json: string; status: number }>(
    API_URL + `/sales/get-json/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const update_seal_sale = (pdf: string, dte: string, sello: string) => {
  const token = get_token();
  return axios.put(
    API_URL + '/sales/sale-update-transaction',
    { pdf, dte, sello },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

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

export const get_sale_details = (id: number) => {
  const token = get_token();
  return axios.get<IGetSaleDetails>(API_URL + `/sales/sale-details/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_graphic_for_category_products_for_dates = (
  id: number,
  startDate: string,
  endDate: string,
  branch = ''
) => {
  return axios.get<IGraphicForCategoryProductsForDates>(
    API_URL +
      `/sales/graphic-for-category-products-for-dates/${id}?startDate=` +
      startDate +
      '&endDate=' +
      endDate +
      '&branch=' +
      branch
  );
};

export const get_graphic_sub_category_products_for_dates = (
  id: number,
  startDate: string,
  endDate: string,
  branch = ''
) => {
  return axios.get<IGraphicSubCategoryProductsForDates>(
    API_URL +
      `/sales/graphic-sub-category-products-for-dates/${id}?startDate=` +
      startDate +
      '&endDate=' +
      endDate +
      '&branch=' +
      branch
  );
};

export const get_sales_by_product = (
  id: number,
  startDate: string,
  endDate: string,
  branch = ''
) => {
  return axios.get<IGetSaleByProduct>(
    API_URL +
      `/sales/get-sales-by-product/${id}?startDate=${startDate}&endDate=${endDate}&branch=${branch}`
  );
};

export const get_sales_by_ccf = (transmiter: number, month: string) => {
  return axios.get<IGetSalesCCF>(API_URL + `/reports/get-ccf-by-month/${transmiter}?month=${month}`)
}

export const get_factura_by_month = (branchId: number, month: number) => {
  return axios.get<IGetFacturasByMonth>(
    API_URL + `/reports/get-fe-by-month/${branchId}?month=${month}`
  )
}