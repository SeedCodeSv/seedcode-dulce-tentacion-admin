
import axios from 'axios';

import { IResponseDataInventoryMovement, IResponseInventaryMovement } from '@/types/reports/inventory_movement';
import { API_URL } from '@/utils/constants';


export const get_inventory_movement = (
  id: number,
  page: number,
  limit: number,
  startDate: string,
  endDate: string,
  branch: string,
  typeOfInventory: string,
  typeOfMovement: string
) => {
  return axios.get<IResponseDataInventoryMovement>(
    import.meta.env.VITE_API_URL +
      `/reports/table-inventary-movement/${id}?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&branch=${branch}&typeOfInventory=${typeOfInventory}&typeOfMovement=${typeOfMovement}`
  );
};

export const get_inventory_movement_graphic = (
  id: number,
  startDate: string,
  endDate: string,
  branch: string
) => {
  return axios.get<IResponseInventaryMovement>(
    API_URL +
      `/reports/report-inventory-movement/${id}?startDate=${startDate}&endDate=${endDate}&branch=${branch}`
  );
};
