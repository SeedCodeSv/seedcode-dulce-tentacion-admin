import { IGetShoppingReport } from '@/types/shopping.types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';

export const get_branch_shopping_report = (branch: number, month: string) => {
  return axios.get<IGetShoppingReport>(API_URL + `/reports/get-shoppings-by-month/${branch}?month=${month}`);
};
