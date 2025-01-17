import { create } from 'zustand';
import { SettlementDocumentStore } from './types/settlement-document.store.types';
import { get_settlement_documents_pagination } from '@/services/settlement-document.service';
import { formatDate } from '@/utils/dates';

export const useSettlementDocumentStore = create<SettlementDocumentStore>((set) => ({
  settlementDocuments: [],
  paginationSettlementDocuments: {
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 0,
    ok: false,
  },
  loadingSettlementDocuments: false,
  searchParams:{
    page: 1,
    limit: 5,
    transmitterId: 0,
    startDate: formatDate(),
    endDate: formatDate(),
    supplierId: 0
  },
  onGetSettlementDocuments(page, limit, transmitterId, startDate, endDate, supplierId) {
    set({ loadingSettlementDocuments: true });
    get_settlement_documents_pagination(page, limit, transmitterId, startDate, endDate, supplierId)
      .then((res) => {
        if (res.data.settlementDocuments) {
          set({
            settlementDocuments: res.data.settlementDocuments,
            paginationSettlementDocuments: res.data,
            loadingSettlementDocuments: false,
          });
        } else {
          set({
            settlementDocuments: [],
            paginationSettlementDocuments: {
              total: 0,
              totalPag: 0,
              currentPag: 0,
              nextPag: 0,
              prevPag: 0,
              status: 0,
              ok: false,
            },
            loadingSettlementDocuments: false,
          });
        }
      })
      .catch(() => {
        set({
          settlementDocuments: [],
          paginationSettlementDocuments: {
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 0,
            ok: false,
          },
          loadingSettlementDocuments: false,
        });
      });
  },
}));
