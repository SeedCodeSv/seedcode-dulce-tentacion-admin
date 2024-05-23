import { Box } from './box.types';

export interface IAuthPayload {
  userName: string;
  password: string;
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

export interface UserLogin {
  id: number;
  userName: string;
  branch: Branch;
  active: boolean;
  role: Role;
  employee: Employee;
  roleId: number;
  employeeId: number;
  transmitterId: number;
}

export interface IAuthResponse {
  ok: boolean;
  token: string;
  box: Box;
  user: UserLogin;
  status: number;
}
