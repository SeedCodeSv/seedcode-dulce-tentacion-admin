import axios from 'axios';
import { API_URL } from '../utils/constants';
import {
  IBranchPayload,
  IGetBranchProductList,
  IGetBranchesList,
  IGetBranchesPaginated,
} from '../types/branches.types';
import { get_token, get_user } from '../storage/localStorage';

export const get_branches_pagination = (
  page: number,
  limit: number,
  name: string,
  phone: string,
  address: string,
  active = 1
) => {
  const token = get_token() ?? '';
  const user = get_user();
  return axios.get<IGetBranchesPaginated>(
    API_URL + '/branches/list-paginated/' + user?.correlative?.branch.transmitterId ??
      user?.pointOfSale?.branch.transmitterId ??
      0 +
        '?page=' +
        page +
        '&limit=' +
        limit +
        '&name=' +
        name +
        '&phone=' +
        phone +
        '&address=' +
        address +
        '&active=' +
        active,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const get_branches_list = () => {
  const user = get_user();
  const token = get_token() ?? '';
  return axios.get<IGetBranchesList>(
    API_URL +
      `/branches/list-by-transmitter/${user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const save_branch = (payload: IBranchPayload) => {
  const token = get_token() ?? '';
  return axios.post<{ ok: boolean }>(API_URL + '/branches', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patch_branch = (payload: IBranchPayload, id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(API_URL + '/branches/' + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const disable_branch = (id: number, state: boolean) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(
    API_URL + '/branches/disable/' + id,
    { state },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const delete_branch = (id: number) => {
  const token = get_token() ?? '';
  return axios.delete<{ ok: boolean }>(API_URL + '/branches/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const get_branch_products = (
  id: number,
  page: number,
  limit: number,
  name: string,
  category: string,
  code: string
) => {
  const token = get_token() ?? '';
  return axios.get<IGetBranchProductList>(
    API_URL +
      `/branch-products/by-branch/${id}?page=${page}&limit=${limit}&name=${name}&category=${category}&code=${code}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const save_active_branch = (id: number, state: boolean) => {
  return axios.patch<{ ok: boolean }>(API_URL + '/branches/activate/' + id, (state = !state));
};
