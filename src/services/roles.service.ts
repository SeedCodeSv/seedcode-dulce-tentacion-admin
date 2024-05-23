import axios from 'axios';
import { API_URL } from '../utils/constants';
import { IGetRoleList } from '../types/roles.types';
import { get_token } from '../storage/localStorage';

export const get_all_roles = () => {
  const token = get_token() ?? '';
  return axios.get<IGetRoleList>(API_URL + '/roles', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
