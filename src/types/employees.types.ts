import { Branches } from './branches.types';

export interface Charge {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Employee {
  id: number;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  bankAccount: string;
  chargeId: number;
  charge: Charge;
  nit: string;
  dui: string;
  isss: string;
  phone: string;
  isActive: boolean;
  branch: Branches;
  branchId: number;
}

export interface IGetEmployeesPaginated {
  ok: boolean;
  employees: Employee[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface EmployeePayload {
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  bankAccount: string;
  chargeId: number;
  nit: string;
  dui: string;
  isss: string;
  phone: string;
  branchId: number;
}
export interface GetEmployeeList {
  ok: boolean;
  message: string;
  employees: Employee[];
}
