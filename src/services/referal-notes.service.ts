import axios from 'axios';

import { IGetRecenReferal, IGetReferalNotes, PayloadReferel } from '@/types/referal-note.types';
import { API_URL } from '@/utils/constants';

export const get_referal_notes = (
  transmitterId: number,
  page: number,
  limit: number,
  startDate: string,
  endDate: string
) => {
  const params = new URLSearchParams({
    startDate: startDate,
    endDate: endDate,
    page: page.toString(),
    limit: limit.toString(),
  });

  return axios.get<IGetReferalNotes>(
    API_URL + '/referal-note/paginated/' + transmitterId + '?' + params.toString()
  );
};

export const complete_referal_note = async (id: number, payload:PayloadReferel) => {
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


