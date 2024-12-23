import { GetDetailTicket, GetTicketsResponse } from '@/types/ticket.types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';

export const get_tickets = (
  id: number,
  page: number,
  limit: number,
  startDate: string,
  endDate: string,
  branchId: number
) => {
  return axios.get<GetTicketsResponse>(
    API_URL +
      `/reports/tickets-by-day-table/${id}?startDate=${startDate}&endDate=${endDate}&branchId=${branchId}&page=${page}&limit=${limit}`
  );
};

export const get_ticket = (id: number) => {
  return axios.get<GetDetailTicket>(
    API_URL + `/detail-sales/${id}`
  );
};