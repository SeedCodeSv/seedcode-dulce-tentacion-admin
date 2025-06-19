import axios from 'axios';

import { API_URL } from '@/utils/constants';
import { IGetDebitNote, IGetListDebitNotes, IRecentDebitNotes } from '@/types/debit-notes.types';
import { IGetAllDebitNotes } from '@/types/debit-notes.types';
import { SearchGlobal } from '@/types/global.types';

export const get_debit_notes_by_id = (id: number) => {
    return axios.get<IGetDebitNote>(`${API_URL}/nota-de-debitos/${id}`);
}

export const get_recent_debit_notes = (id: number, saleId: number) => {
    return axios.get<IRecentDebitNotes>(`${API_URL}/nota-de-debito/recent-by-sales/${saleId}/${id}`);
}

export const get_contingence_debit_notes = (branchId: number) => {
    return axios.get<IGetAllDebitNotes>(API_URL + `/nota-de-debitos/list-contingence/${branchId}`)
}

  export const get_debit_notes = (params: SearchGlobal) => {
    return axios.get<IGetListDebitNotes>(API_URL + `/nota-de-debitos/list/${params.branchId}?page=${params.page}&limit=${params.limit}&startDate=${params.startDate}&endDate=${params.endDate}`);
  };