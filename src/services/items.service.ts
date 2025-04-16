import { GetItemsByDailyMajor, GetItemsByMajor, GetItemsForBalance, GetMajorAccounts, IGetItemsDates } from '@/types/items.types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';

export const get_items_by_dates = (transId: number, startDate: string, endDate: string) => {
  return axios.get<IGetItemsDates>(
    API_URL + `/reports/itemsByDates/${transId}?startDate=${startDate}&endDate=${endDate}`
  );
};

export const get_items_by_major = (transmitterId: number, startDate: string, endDate: string) => {
  return axios.get<GetItemsByMajor>(
    API_URL + `/reports/itemsByMajor/${transmitterId}?startDate=${startDate}&endDate=${endDate}`
  );
};

export const get_items_by_daily_major = (
  transmitterId: number,
  startDate: string,
  endDate: string
) => {
  return axios.get<GetItemsByDailyMajor>(
    API_URL +
      `/reports/itemsByDailyMajor/${transmitterId}?startDate=${startDate}&endDate=${endDate}`
  );
};

export const get_items_by_daily_major_account = (
  transmitterId: number,
  startDate: string,
  endDate: string,
  account: string[]
) => {

  const params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  account.forEach((acc) => params.append('account', acc));

  return axios.get<GetItemsByDailyMajor>(
    API_URL +
      `/reports/itemsByMajorAccounts/${transmitterId}?${params.toString()}`
  );
};

export const get_list_of_major = (id: number) => {
  return axios.get<GetMajorAccounts>(
    API_URL + `/reports/listOfMajor/${id}`
  );
};

export const get_items_for_balance = (transmitterId: number, startDate: string, endDate: string) => {
  return axios.get<GetItemsForBalance>(
    API_URL + `/reports/itemsByBalanceList/${transmitterId}?startDate=${startDate}&endDate=${endDate}`
  );
};
