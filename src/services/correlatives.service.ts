import axios from 'axios';

import { get_token } from '../storage/localStorage';
import { API_URL } from '../utils/constants';
import { IGetCorrelatives } from '../types/correlatives.types';

export const get_correlatives = (id: number) => {
  const token = get_token() ?? null;

  return axios.get<IGetCorrelatives>(`${API_URL}/correlatives/by-branch/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
