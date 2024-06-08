import { Customer } from "./customers.types";
import { IPagination } from "./global.types";

export interface IGetAccountReceivable extends IPagination {
  accounts: IAccountReceivable[];
}

export interface IGetListAccountReceivable {
  ok: boolean;
  accounts: IAccountReceivable[];
  status: number;
}
export interface IAccountReceivable {
  id: number;
  debt: number;
  generationCode: string;
  paid: number;
  interest: number;
  remaining: number;
  date: Date;
  period: number;
  deadline: string;
  periodPaid: string;
  paidEach: number;
  isActive: boolean;
  customer: Customer;
  customerId: number;
}

export interface IGetPayments {
  ok: boolean;
  payments: IPayment[];
  status: number;
}

export interface IPayment {
  id: number;
  date: Date;
  code: string;
  amount: number;
  reference: string;
  remaining: number;
  isActive: boolean;
  saleId: number;
  accountId: number;
}

