import axios from 'axios';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';
import { IActionPayload, ICraeteView, ICreateRoleActionPayload, IGetActionRol } from '../types/actions.types';

export const save_action = (action: IActionPayload) => {
  const token = get_token() ?? '';
  return axios.post<IGetActionRol>(`${API_URL}/actions`, action, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const create_action_by_view = (action: IActionPayload) => {
  const token = get_token() ?? '';
  return axios.post<IGetActionRol>(`${API_URL}/actions`, action, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const create_role_action = (action: ICreateRoleActionPayload) => {
  const token = get_token() ?? '';
  return axios.post<IGetActionRol>(`${API_URL}/role-actions`, action, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const  create_view = (views: ICraeteView) => {
  return axios.post<IGetActionRol>(API_URL + `/view`, {
    ...views,
    type: 'Drawer',
  });
};
