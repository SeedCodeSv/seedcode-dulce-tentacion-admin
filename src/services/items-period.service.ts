import axios from 'axios';

import { get_token } from '@/storage/localStorage';
import { IFindPeriod } from '@/types/items-period.types';
import { API_URL } from '@/utils/constants';

export const find_period = (transId: number, startDate: string, endDate: string, branches: number[]) => {
  const params = new URLSearchParams();

  params.append('startDate', startDate);
  params.append('endDate', endDate);

  const token = get_token() ?? '';

  branches.forEach((branch) => params.append('branches', branch.toString()));

  return axios.get<IFindPeriod>(API_URL + `/items-period/check-period/${transId}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const create_period = (
  startDate: string,
  endDate: string,
  branches: number[],
  itemId: number
) => {
  const token = get_token() ?? '';

  return axios.post<IFindPeriod>(
    API_URL + `/items-period`,
    { branches, startDate, endDate, itemId },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const update_period = (
  id: number,
  startDate: string,
  endDate: string,
  branches: number[],
  itemId: number
) => {
  const token = get_token() ?? '';

  return axios.patch<IFindPeriod>(
    API_URL + `/items-period/${id}`,
    { branches, startDate, endDate, itemId },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
