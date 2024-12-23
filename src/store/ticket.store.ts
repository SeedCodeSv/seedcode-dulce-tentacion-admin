import { create } from 'zustand';
import { TicketsStore } from './types/tickets.store.types';
import { get_ticket, get_tickets } from '@/services/ticket.service';

export const useTicketStore = create<TicketsStore>((set) => ({
  tickets: [],
  ticketPagination: {
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 0,
    ok: false,
  },
  isLoading: false,
  totalSales: 0,
  ticket: [],
  onGetTicket: (id: number) => {
    set({ isLoading: true });
    get_ticket(id)
      .then((res) => {
        if (res.data.ok) {
          set({
            ticket: res.data.detailSale,
            isLoading: false,
          });
        } else {
          set({
            ticket: undefined,
            isLoading: false,
          });
        }
      })
      .catch(() => {
        set({
          ticket: undefined,
          isLoading: false,
        });
      });
  },
  onGetTickets: async (page, limit, startDate, endDate, branchId) => {
    set({ isLoading: true, totalSales: 0 });
    await get_tickets(1, page, limit, startDate, endDate, branchId)
      .then((res) => {
        if (res.data.ok) {
          set({
            totalSales: res.data.totalSales,
            tickets: res.data.sales,
            ticketPagination: res.data,
            isLoading: false,
          });
        } else {
          set({
            totalSales: 0,
            tickets: [],
            ticketPagination: {
              total: 0,
              totalPag: 0,
              currentPag: 0,
              nextPag: 0,
              prevPag: 0,
              status: 0,
              ok: false,
            },
            isLoading: false,
          });
        }
      })
      .catch(() => {
        set({
          totalSales: 0,
          tickets: [],
          ticketPagination: {
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 0,
            ok: false,
          },
          isLoading: false,
        });
      });
  },
}));
