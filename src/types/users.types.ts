export interface IGetUsers {
  ok: boolean;
  message: string;
  users: User[];
}

export interface UserPayload {
  userName: string;
  password: string;
  roleId: number;
  // employeeId: number;
  correlativeId: number;
}
export interface UserUpdate {
  userName: string;
  roleId: number;
  employeeId: number;
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
  id: number;
  fullName: string;
  phone: string;
  isActive: boolean;
  branch: Branch;
  branchId: number;
}

export interface User {
  id: number;
  userName: string;
  active: boolean;
  role: Role;
  employee: Employee;
  roleId: number;
  employeeId: number;
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
