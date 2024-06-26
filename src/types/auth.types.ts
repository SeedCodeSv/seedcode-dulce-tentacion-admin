
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
  ok: boolean
  token: string
  user: User
  box: Box
  status: number
}

export interface User {
  id: number
  userName: string
  active: boolean
  role: Role
  correlative: Correlative
  roleId: number
  correlativeId: number
}

export interface Role {
  id: number
  name: string
  isActive: boolean
}

export interface Correlative {
  id: number
  code: string
  typeVoucher: string
  resolution: string
  serie: string
  from: string
  to: string
  prev: number
  next: number
  isActive: boolean
  branch: Branch
  branchId: number
}

export interface Branch {
  id: number
  name: string
  address: string
  phone: string
  isActive: boolean
  transmitterId: number
}

export interface Box {
  id: number
  start: string
  end: string
  totalSales: string
  totalExpense: string
  totalIva: string
  date: string
  time: string
  isActive: boolean
  correlativeId: number
}

