import axios from 'axios';

import { get_token } from '../storage/localStorage';
import {
  IGetActionRolList,
  IAddActionRol,
  IResponseDataRoleActions,
  IUpdateActionDto,
  ICreateActionDto,
  IGetIRoleAction,
} from '../types/actions_rol.types';

export const get_actions_by_rol_and_view = (rolId: number, viewId: number) => {
  const token = get_token() ?? '';

  return axios.get<IGetActionRolList>(
    `${import.meta.env.VITE_API_URL}/role-actions/by-rol-and-view/${rolId}/${viewId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const save_action_rol = (actionRol: IAddActionRol) => {
  const token = get_token() ?? '';

  return axios.post(`${import.meta.env.VITE_API_URL}/role-actions`, actionRol, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_actions_role = () => {
  const token = get_token() ?? '';

  return axios.get<IResponseDataRoleActions>(import.meta.env.VITE_API_URL + '/role-actions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_actions_by_role = (rol_id: number) => {
  return axios.get<IGetActionRolList>(import.meta.env.VITE_API_URL + `/role-actions/byRol/${rol_id}`);
};

export const update_actions = (actionRol: IUpdateActionDto) => {
  return axios.patch<IGetActionRolList>(import.meta.env.VITE_API_URL + '/actions/update-list', actionRol);
};

export const create_many_actions = (payload: ICreateActionDto) => {
  return axios.post<{ ok: boolean }>(import.meta.env.VITE_API_URL + '/role-actions/create-many', payload);
};

export const get_role_actions = (roleId: number) => {
  return axios.get<IGetIRoleAction>(import.meta.env.VITE_API_URL + `/role-actions/byRol/${roleId}`);
};

export const get_role_actions_user = (roleId: number) => {
  return axios.get<IGetIRoleAction>(import.meta.env.VITE_API_URL + `/role-actions/byRolUser/${roleId}`);
};