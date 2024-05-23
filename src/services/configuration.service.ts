import {
  GetByTransmitter,
  IGetConfiguration,
  pachConfigurationName,
} from './../types/configuration.types';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';

export const create_configuration = async (configuration: IGetConfiguration) => {
  const token = get_token() ?? '';
  const formData = new FormData();
  if (configuration.file) {
    formData.append('file', configuration.file);
  }
  formData.append('name', configuration.name);
  formData.append('themeId', configuration.themeId.toLocaleString());
  formData.append('transmitterId', configuration.transmitterId.toLocaleString());
  return axios.post<{ ok: boolean; status: number }>(API_URL + '/personalization', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_by_transmitter = (id: number) => {
  const token = get_token() ?? '';
  return axios.get<GetByTransmitter>(`${API_URL}/personalization/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const update_configuration_name = (payload: pachConfigurationName, id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(API_URL + '/personalization/' + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
