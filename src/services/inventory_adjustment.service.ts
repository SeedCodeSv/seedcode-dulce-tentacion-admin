import axios from 'axios';

import { ICreateInventoryAdjustment } from '../types/inventory_adjustment.types';

import { API_URL } from '@/utils/constants';
import { get_token } from '@/storage/localStorage';

export const create_inventory_adjustment =  (data: ICreateInventoryAdjustment) => {
  const token = get_token()

  return  axios.post(API_URL + '/inventory-adjustment', data,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  });
};
export const recount_stock_inventory_adjustment =  (data: ICreateInventoryAdjustment) => {
  const token = get_token()

  return axios.post(API_URL + '/inventory-adjustment', data,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  });
};
