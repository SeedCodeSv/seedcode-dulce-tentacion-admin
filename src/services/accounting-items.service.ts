import { get_token } from '@/storage/localStorage';
import {
  AddItem,
  EditItem,
  GetAccountingItems,
  GetDetails,
  Item,
  VerifyItemCount,
} from '@/types/accounting-items.types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';

export const create_item = (payload: AddItem) => {
  const token = get_token();
  return axios.post<{ ok: boolean; item: Item }>(API_URL + '/items', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const update_and_delete = (payload: AddItem, id: number) => {
  const token = get_token();
  return axios.patch<{ ok: boolean; item: Item }>(
    API_URL + `/items/update-and-delete/${id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const update_item = (payload: EditItem, id: number) => {
  const token = get_token();
  return axios.patch(API_URL + '/items/update/' + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_accounting_items = (
  id: number,
  page: number,
  limit: number,
  startDate: string,
  endDate: string,
  typeItem: string,
  typeOrder: string
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    startDate,
    endDate,
    typeItem,
    typeOrder,
  });
  const token = get_token();
  return axios.get<GetAccountingItems>(
    `${API_URL}/items/paginate/${id}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verify_item_count = (code: string) => {
  const token = get_token();
  return axios.get<VerifyItemCount>(`${API_URL}/items/verify/${code}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_details = (id: number) => {
  const token = get_token();
  return axios.get<GetDetails>(`${API_URL}/items/details/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const delete_item = (id: number) => {
  const token = get_token();
  return axios.delete(`${API_URL}/items/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_report_for_item = (id: number) => {
  const token = get_token();
  return axios.get(`${API_URL}/reports/forItem/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
