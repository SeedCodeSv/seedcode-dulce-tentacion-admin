import axios from 'axios';

import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';
import { IGetBoxList, IBoxPayload, IGetBox, ICloseBox, IResponseBox, IResponseExportBox } from '../types/box.types';
import { formatDate } from '../utils/dates';

export const get_boxes_List = async () => {
  const token = get_token() ?? '';

  return await axios.get<IGetBoxList>(`${API_URL}/box`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const save_box = async (payload: IBoxPayload) => {
  const token = get_token() ?? '';

  return await axios.post<IGetBox>(`${API_URL}/box`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const verify_box = async (idBrach: number) => {
  const token = get_token() ?? '';

  return await axios.get<IGetBox>(
    `${API_URL}/box/verify-by-branch/${idBrach}?startDate=${formatDate()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const close_box = (closeBox: ICloseBox, idBox: number) => {
  const token = get_token() ?? '';

  return axios.post<IGetBox>(`${API_URL}/detail-box/save-detail/${idBox}`, closeBox, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const close_box_by_id = (idBox: number) => {
  const token = get_token() ?? '';

  return axios.delete<IGetBox>(API_URL + `/box/close-box/` + idBox, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// export const get_list_paginated_boxes = (
//   page: number,
//   limit: number,
//   branch: string,
//   startDate: string,
//   endDate: string
// ) => {
//   const token = get_token() ?? '';

//   return axios.get<IResponseBox>(`${API_URL}/box/paginated-box?page=${page}&limit=${limit}&branch=${branch}&startDate=${startDate}&endDate=${endDate}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     }
//   }
//   )
// }

export const get_list_paginated_boxes = (
  page: number,
  limit: number,
  branches: number[],
  startDate: string,
  endDate: string
) => {

  const token = get_token() ?? '';

  return axios.get<IResponseBox>(`${API_URL}/box/paginated-box`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
      branches,
      startDate,
      endDate,
    },
  });
};
export const get_report_excell_boxes = (

  branches: number[],
  startDate: string,
  endDate: string
) => {

  const token = get_token() ?? '';

  return axios.get<IResponseExportBox>(`${API_URL}/box/export-report-box`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      branches,
      startDate,
      endDate,
    },
  });
};