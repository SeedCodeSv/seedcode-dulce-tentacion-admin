import axios from 'axios';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';
import { IGetAccountReceivable, IGetListAccountReceivable, IGetPayments } from '../types/account_receivable.types';

export const get_accounts_receivable = (page: number, limit: number) => {
  const token = get_token();
  return axios.get<IGetAccountReceivable>(
    API_URL +
    `/accounts-receivable/paginated?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const get_account_receivable_list = () => {
  const token = get_token();
  return axios.get<IGetListAccountReceivable>(
    API_URL +
    `/accounts-receivable`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const get_payments_by_account = (id: number) => {
  const token = get_token();
  return axios.get<IGetPayments>(
    API_URL +
    `/accounts-receivable/payments/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};