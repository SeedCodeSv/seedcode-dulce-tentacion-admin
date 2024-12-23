import { IPagination } from '@/types/global.types';
import { DetailSale, Sale } from '@/types/ticket.types';

export interface TicketsStore {
  tickets: Sale[];
  ticketPagination: IPagination;
  isLoading: boolean;
  totalSales: number;
  ticket: DetailSale[];
  onGetTicket: (id: number) => void;
  onGetTickets: (
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    branchId: number
  ) => void;
}
