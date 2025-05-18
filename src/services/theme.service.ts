import axios from 'axios';

import { findOne, IGetPaginationThemes, ThemePayload } from '../types/themes.types';

import { get_user } from './../storage/localStorage';

export const save_theme = (theme: ThemePayload) => {
  return axios.post<{ ok: boolean }>(import.meta.env.VITE_API_URL + '/theme', theme);
};

export const get_themes_paginated = (page = 1, limit = 30) => {
  const user = get_user();

  return axios.get<IGetPaginationThemes>(
    import.meta.env.VITE_API_URL +
      `/theme/list-paginated/${user?.transmitterId}?page=${page}&limit=${limit}`
  );
};

export const update_theme = (id: number, theme: ThemePayload) => {
  return axios.patch<{ ok: boolean }>(import.meta.env.VITE_API_URL + '/theme/' + id, theme);
};

export const delete_theme = (id: number) => {
  return axios.delete<{ ok: boolean }>(import.meta.env.VITE_API_URL + `/theme/${id}`);
};

export const get_theme_find_one = (id: number) => {
  return axios.get<findOne>(import.meta.env.VITE_API_URL + `/theme/${id}`);
};
