import { get_token } from '@/storage/localStorage';
import {
  Correlatives,
  IResponseDataCorrelatives,
  ResponseDataCorrelative,
} from '@/types/correlatives/correlatives_types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';

export const get_by_branch_and_typeVoucher = (
  page: number,
  limit: number,
  branchName: string,
  typeDte: string
) => {
  return axios.get<IResponseDataCorrelatives>(
    API_URL +
      `/correlatives/list-paginated?page=${page}&limit=${limit}&branch=${branchName}&typeDte=${typeDte}`
  );
};

export const update_correlatives = (id: number, data: Correlatives) => {
  delete data.id;
  delete data.branch;
  const token = get_token();
  return axios.patch<ResponseDataCorrelative>(`${API_URL}/correlatives/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
