import { GetItemsByMajor, IGetItemsDates } from '@/types/items.types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';

export const get_items_by_dates = (transId: number, startDate: string, endDate: string) => {
  return axios.get<IGetItemsDates>(
    API_URL + `/reports/itemsByDates/${transId}?startDate=${startDate}&endDate=${endDate}`
  );
};

export const get_items_by_major = (transmitterId: number, startDate: string, endDate: string) => {
  return axios.get<GetItemsByMajor>(API_URL + `/reports/itemsByMajor/${transmitterId}?startDate=${startDate}&endDate=${endDate}`);
};
