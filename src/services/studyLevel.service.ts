import axios from 'axios';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';

import { IGetStudyLevelPaginated } from '../types/studyLevel.types';

export const get_study_level = (page = 1, limit = 8, name = '', description = '', active = 1) => {
  const token = get_token() ?? '';
  return axios.get<IGetStudyLevelPaginated>(
    API_URL +
      `/study-level/list-paginated?page=${page}&limit=${limit}&name=${name}&description=${description}&active=${active}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const create_study_level = ({
  name
}: {
  name: string;
  description: string;
}) => {
  const token = get_token() ?? '';
  return axios.post<{ ok: boolean }>(
    API_URL + '/study-level',
    {
      name,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const update_study_level = (
  { name }: { name: string; description: string },
  id: number
) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(
    API_URL + '/study-level/' + id,
    {
      name,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const delete_study_level = (id: number) => {
  const token = get_token() ?? '';
  return axios.delete<{ ok: boolean }>(API_URL + '/study-level/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
