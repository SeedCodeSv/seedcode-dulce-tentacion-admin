import axios from 'axios';

import { get_token, get_user } from '@/storage/localStorage';
import {
  Correlatives,
  CreateCorrelativesDto,
  IResponseDataCorrelatives,
  ResponseDataCorrelative,
} from '@/types/correlatives/correlatives_types';
import { API_URL } from '@/utils/constants';

export const get_by_branch_and_typeVoucher = (
  page: number,
  limit: number,
  branchName: string,
  typeDte: string
) => {
  const user = get_user()
  const token = get_token()

  return axios.get<IResponseDataCorrelatives>(
    API_URL +
    `/point-of-sale/list-paginated/${user?.transmitterId}?page=${page}&limit=${limit}&branch=${branchName}&dteType=${typeDte}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
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

export const create_correlatives = (data: CreateCorrelativesDto) => {
  return axios.post<CreateCorrelativesDto>(`${API_URL}/correlatives`, data);
};
