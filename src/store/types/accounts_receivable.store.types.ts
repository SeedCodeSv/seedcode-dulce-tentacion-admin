import { IAccountReceivable, IGetAccountReceivable, IPayment } from '../../types/account_receivable.types';

export interface IUseAccountReceivableStore {
  accounts: IAccountReceivable[];
  payments: IPayment[];
  accounts_receivable_paginated: IGetAccountReceivable;
  getAccountsReceivableList: () => void;
  getAccountsReceivablePaginated: (page: number, limit: number) => void;
  getPaymentsByAccount: (id: number) => void;
}
