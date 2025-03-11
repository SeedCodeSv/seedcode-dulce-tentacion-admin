import axios from 'axios';
import { ThemePayload } from '../types/themes.types';
import { API_URL } from '../utils/constants';

export const save_theme = (theme: ThemePayload) => {
  return axios.post<{ ok: boolean }>(API_URL + '/theme', theme);
};

export const get_themes_paginated = (page = 1, limit = 30) => {
  return axios.get(API_URL + `/theme/list-paginated?page=${page}&limit=${limit}`);
};

