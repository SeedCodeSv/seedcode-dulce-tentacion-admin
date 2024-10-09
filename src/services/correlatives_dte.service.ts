import axios from 'axios';
import { IGetCorrelativesByTransmitter } from '../types/correlatives_dte.types';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';
import { IGetCorrelatives } from '@/types/correlatives.types';
import { IGetPointOfSaleCorrelative } from '@/types/point-of-sales.types';

export const get_correlatives_dte = (transmitter_id: number, tipo_dte: string) => {
  const token = get_token() ?? null;
  return axios.get<IGetCorrelativesByTransmitter>(
    `${API_URL}/point-of-sale/find-correlative/${transmitter_id}?dteType=${tipo_dte}`,
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

export const get_correlatives_dte_point_of_sales = (userId: number, tipo_dte: string) => {
  const token = get_token() ?? null
  return axios.get<IGetPointOfSaleCorrelative>(
    `${API_URL}/point-of-sale/find-correlative/${userId}?dteType=${tipo_dte}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}
