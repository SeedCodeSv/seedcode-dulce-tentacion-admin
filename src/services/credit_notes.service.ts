import axios from "axios";

import { IGetAllCreditNotes, IGetCreditNote, IRecentCreditNotes } from "@/types/credit_notes.types";
import { API_URL } from "@/utils/constants";

export const get_credit_notes_by_id = (id: number) => {
    return axios.get<IGetCreditNote>(`${API_URL}/nota-de-credito/${id}`);
  };
  
  export const get_recent_credit_notes = (id: number, saleId: number) => {
    return axios.get<IRecentCreditNotes>(`${API_URL}/nota-de-credito/recent-by-sales/${saleId}/${id}`);
  };
  
  export const get_contingence_credit_notes = (branchId: number) => {
    return axios.get<IGetAllCreditNotes>(API_URL + `/nota-de-credito/list-contingence/${branchId}`);
  };