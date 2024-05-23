import axios from 'axios';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';
import { IGetActionRolList, IAddActionRol } from '../types/actions_rol.types';

export const get_actions_by_rol_and_view = (rolId: number, viewId: number) => {
  const token = get_token() ?? '';
  return axios.get<IGetActionRolList>(
    `${API_URL}/role-actions/by-rol-and-view/${rolId}/${viewId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const save_action_rol = (actionRol: IAddActionRol) => {
  const token = get_token() ?? '';
  return axios.post(`${API_URL}/role-actions`, actionRol, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_actions_role = () => {
  const token = get_token() ?? '';
  return axios.get<IGetActionRolList>(API_URL + '/role-actions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_actions_by_role = async (rol_id: number) => {
  return axios.get<IGetActionRolList>(API_URL + `/role-actions/byRol/${rol_id}`);
};
