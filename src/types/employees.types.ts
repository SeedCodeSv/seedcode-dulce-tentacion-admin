import { Branches } from './branches.types';

export interface Employee {
  id: number;
  fullName: string;
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
  fullName: string;
  phone: string;
  branchId: number;
}

export interface GetEmployeeList {
  ok: boolean;
  message: string;
  employees: Employee[];
}
