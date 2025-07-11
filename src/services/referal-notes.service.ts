import axios from 'axios';

import {  IExportExcel, IGetNoteReferalContingence, IGetRecenReferal, IGetReferalNotes, IResponseDetailNote, IResponseNote, IResponseNoteInvali, PayloadReferel } from '@/types/referal-note.types';
import { API_URL } from '@/utils/constants';

export const get_referal_notes = (
  transmitterId: number,
  page: number,
  limit: number,
  startDate: string,
  endDate: string,
  type: string,
  branchId: number
) => {
  const params = new URLSearchParams({
    startDate: startDate,
    endDate: endDate,
    page: page.toString(),
    limit: limit.toString(),
    type: type,
    branchId: branchId.toString()
  });

  return axios.get<IGetReferalNotes>(
    API_URL + '/referal-note/paginated/' + transmitterId + '?' + params.toString()
  );
};

export const export_referal_note = async (transmitterId: number, page: number, limit: number, startDate: string, endDate: string, type: string, branchId: number) => {
  return await axios.get<IExportExcel>(`${API_URL}/referal-note/export-notes-referal/${transmitterId}?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}&type=${type}&branchId=${branchId}`)
}

export const complete_referal_note = async (id: number, payload: PayloadReferel) => {
  return (await axios.post<{ ok: boolean }>(API_URL + `/referal-note/receive/${id}`, payload)).data;
};

export const get_pdf_nre = (code: string) => {
  return axios.get<Blob>(API_URL + `/pdf/nre/${code}`, { responseType: 'blob' });
};

export const re_send_email_nre = (code: string) => {
  return axios.post<{ ok: boolean }>(API_URL + `/pdf/re-send-email-nre/${code}`);
};

export const get_referal_note_recent = (id: number) => {
  return axios.get<IGetRecenReferal>(API_URL + `/referal-note/get-referal-note-recents/${id}`)
}


export const get_list_referal_note = (id: number, page: number, limit: number, important: boolean) => {
  const value = important === true && 1 || important === false && 0

  return axios.get<IResponseNote>(API_URL + `/referal-note/notes-referals-by-branch/${id}?page=${page}&limit=${limit}&important=${value}`)
}

export const get_invalidate_note_referaL = (id: number, page: number, limit: number) => {
  return axios.get<IResponseNoteInvali>(API_URL + `/referal-note/list-invalidate/${id}?page=${page}&limit=${limit}`)
}

export const detail_referal_note = (id: number) => {
  return axios.get<IResponseDetailNote>(`${API_URL}/referal-note/detail-note/${id}`)
}


export const get_referal_in_contingence = (id: number) => {
  return axios.get<IGetNoteReferalContingence>(API_URL + `/referal-note/referal-contingence/${id}`)
}

export const getConsolidatedReferalNotes = (
  startDate: string,
  endDate: string,
  branchId?: number,
  type?: string
) => {
  const params = new URLSearchParams({
    startDate,
    endDate,
    ...(branchId ? { branchId: String(branchId) } : {}),
    ...(type ? { type: String(type) } : {})
  });

  return axios
    .get<IExportExcel>(`${API_URL}/referal-note/consolidated?${params.toString()}`)
    .then((res) => res.data);
};