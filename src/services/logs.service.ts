import axios from 'axios';
import { IGetLogByNumber, Logs } from '../types/logs.types';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';

export const save_logs = (logs: Logs) => {
  return axios.post(`${API_URL}/logs`, logs, {
    headers: {
      Authorization: `Bearer ${get_token() ?? ''}`,
    },
  });
};

export const get_logs = (code: string) => {
  return axios.get<IGetLogByNumber>(`${API_URL}/logs/by-control-number?generationCode=${code}`, {
    headers: {
      Authorization: `Bearer ${get_token() ?? ''}`,
    },
  });
};
