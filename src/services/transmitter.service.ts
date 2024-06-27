import axios from 'axios';
import { API_URL, AUTH_MH } from '../utils/constants';
import { IGetTransmitter, ILoginMH } from '../types/transmitter.types';
import { get_token, get_user } from '../storage/localStorage';
import qs from 'qs';

export const get_transmitter = (id: number, token_send = '') => {
  const token = get_token() ?? '';
  return axios.get<IGetTransmitter>(API_URL + `/transmitter/${id}`, {
    headers: {
      Authorization: `Bearer ${token === '' || !token ? token_send : token}`,
    },
  });
};
export const get_transmitterId = () => {
  const token = get_token() ?? '';
  const user = get_user();
  return axios.get<IGetTransmitter>(
    API_URL + `/transmitter/${user?.correlative.branch.transmitterId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const login_mh = (user: string, password: string) => {
  return axios.post<ILoginMH>(AUTH_MH, qs.stringify({ user, pwd: password }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
