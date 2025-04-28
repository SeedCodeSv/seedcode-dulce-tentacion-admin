import axios from 'axios';

import {
  IGetExpensesByBranch,
  IGetExpensesByDay,
  IResponseDataExpensesGrafic,
} from '../../types/reports/expenses.reports.types';
import { API_URL } from '../../utils/constants';

export const get_expenses_by_branch_month = (id: number) => {
  return axios.get<IGetExpensesByBranch>(API_URL + `/reports/expenses-by-branch/${id}`);
};

export const get_expenses_by_branch = (id: number, startDate: string, endDate: string) => {
  return axios.get<IResponseDataExpensesGrafic>(
    API_URL + `/reports/expenses-by-dates-transmitter/${id}?startDate=${startDate}&endDate=${endDate}`
  );
}

export const get_expenses_by_day = (id: number) => {
  return axios.get<IGetExpensesByDay>(API_URL + `/reports/expenses-by-day/${id}`);
};
