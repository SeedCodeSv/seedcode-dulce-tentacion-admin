import axios from 'axios';

import { IGetShoppingReport } from '@/types/shopping.types';
import { API_URL } from '@/utils/constants';

export const get_branch_shopping_report = (branch: number, month: string) => {
  return axios.get<IGetShoppingReport>(API_URL + `/reports/get-shoppings-by-month/${branch}?month=${month}`);
};


export const get_branch_shopping_annexes = (branch: number, startDate: string, endDate: string) => {
  return axios.get<IGetShoppingReport>(API_URL + `/reports/anexos-compras/${branch}?startDate=${startDate}&endDate=${endDate}`);
};
