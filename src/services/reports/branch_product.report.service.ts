import axios from 'axios';
import { IGetProductMostSelled } from '../../types/reports/branch_product.reports';
import { API_URL } from '../../utils/constants';

export const get_most_selled_product = (id: number) => {
  return axios.get<IGetProductMostSelled>(API_URL + `/reports/most-product-selled/${id}`);
};

