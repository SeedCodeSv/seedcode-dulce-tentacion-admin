import { IPagination } from '@/types/global.types';
import { SettlementDocument } from '@/types/settlement_document.types';

export interface SettlementDocumentStore {
  settlementDocuments: SettlementDocument[];
  paginationSettlementDocuments: IPagination;
  loadingSettlementDocuments: boolean;
  searchParams: {
    page: number;
    limit: number;
    transmitterId: number;
    startDate: string;
    endDate: string;
    supplierId: number;
  };
  onGetSettlementDocuments: (
    page: number,
    limit: number,
    transmitterId: number,
    startDate: string,
    endDate: string,
    supplierId: number
  ) => void;
}
