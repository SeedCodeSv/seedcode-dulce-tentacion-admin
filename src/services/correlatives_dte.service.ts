import axios from 'axios';
import { IGetCorrelativesByTransmitter } from '../types/correlatives_dte.types';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';

export const get_correlatives_dte = async (transmitter_id: number, tipo_dte: string) => {
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
