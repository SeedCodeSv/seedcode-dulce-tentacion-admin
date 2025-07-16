import axios from 'axios';

import { IGetProductLoss, IGetProductMostSelled } from '../../types/reports/branch_product.reports';
import { API_URL } from '../../utils/constants';

import { SearchReport } from '@/types/reports/productsSelled.report.types';

export const get_most_selled_product = (id: number) => {
  return axios.get<IGetProductMostSelled>(API_URL + `/reports/most-product-selled/${id}`);
};

export const get_report_product_loss = (params: SearchReport) => {
 const branchquery = params.branchId === 0 ? '' : `branchId=${params.branchId}` 
  const query = `page=${params.page}&limit=${params.limit}&startDate=${params.startDate}&endDate=${params.endDate}&source=${params.name}&${branchquery}`

  return axios.get<IGetProductLoss>(API_URL + `/product-loss/report/paginated?${query}`);
};

