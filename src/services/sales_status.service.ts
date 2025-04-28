import axios from 'axios';

import { IGetSalesStatus } from '../types/sales_status.types';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';

export const get_sales_status = () => {
  return axios.get<IGetSalesStatus>(API_URL + '/sales-status', {
    headers: {
      Authorization: `Bearer ${get_token()}`,
    },
  });
};
