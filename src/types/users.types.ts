import { Correlatives } from './correlatives.types';

export interface IGetUsers {
  ok: boolean;
  message: string;
  users: User[];
}

export interface UserPayload {
  userName: string;
  password: string;
  roleId: number;
  userId?: number;
}
export interface UserUpdate {
  userName: string;
  roleId: number;
}
export interface Role {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  transmitterId: number;
}

export interface Employee {
  addressId: number;
  afp: string;
  age: number;
  bankAccount: string;
  branchId: number;
  chargeId: number;
  code: string;
  contractTypeId: number;
  dateOfBirth: string;
  dateOfEntry: string;
  dateOfExit: null;
  dui: string;
  employeeStatusId: string;
  firstLastName: string;
  firstName: string;
  id: number;
  isActive: boolean;
  isss: string;
  nit: string;
  phone: string;
  responsibleContact: string;
  salary: string;
  secondLastName: string;
  secondName: string;
  studyLevelId: number;
}

export interface User {
  id: number;
  userName: string;
  active: boolean;
  role: Role;
  // employee: Employee;
  roleId: number;
  correlativeId: number;
  correlative: Correlatives;
  // employeeId: number;
}

export interface RootObject {
  ok: boolean;
  message: string;
  users: User[];
}

export interface IGetUserPaginated {
  ok: boolean;
  users: User[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface IResponseRoles {
  ok: boolean;
  message: string;
  status: number;
  roles: Role[];
}
