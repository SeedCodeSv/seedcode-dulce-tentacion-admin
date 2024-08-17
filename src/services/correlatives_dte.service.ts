import axios from 'axios';
import { IGetCorrelativesByTransmitter } from '../types/correlatives_dte.types';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';
import { IGetCorrelatives } from '@/types/correlatives.types';

export const get_correlatives_dte = (transmitter_id: number, tipo_dte: string) => {
  const token = get_token() ?? null;
  return axios.get<IGetCorrelativesByTransmitter>(
    `${API_URL}/correlatives-dte/find-correlative/${transmitter_id}?dteCode=${tipo_dte}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const get_point_of_sales = (branch_id: number) => {
  const token = get_token() ?? null;
  return axios.get<IGetCorrelatives>(`${API_URL}/correlatives/by-branch/${branch_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
