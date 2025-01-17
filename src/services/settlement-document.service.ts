import { get_token } from '@/storage/localStorage';
import {
  GetSettlementDocument,
  PostSettlementDocumentPayload,
  PostSettlementDocumentResponse,
} from '@/types/settlement_document.types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';

export const save_settlement_document = (payload: PostSettlementDocumentPayload) => {
  const token = get_token();
  return axios.post<PostSettlementDocumentResponse>(API_URL + '/settlement-document', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_settlement_documents_pagination = (
  page = 1,
  limit = 5,
  transmitterId: number,
  startDate: string,
  endDate: string,
  supplierId: number
) => {
  return axios.get<GetSettlementDocument>(
    API_URL +
      `/settlement-document/paginate/${transmitterId}?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&supplierId=${supplierId}`
  );
};
