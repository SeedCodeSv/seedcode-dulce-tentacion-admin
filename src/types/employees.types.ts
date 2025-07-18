import { Branches } from './branches.types';
import { ICharge } from './charges.types';
import { ContractType } from './contract_type.types';
import { EmployeeStatus } from './employee_status.types';
import { IPagination } from './global.types';
import { StudyLevel } from './study_level.types';

export interface Employee {
  id: number;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  bankAccount: string;
  nit: string;
  dui: string;
  isss: string;
  afp: string;
  code: string;
  phone: string;
  age: string;
  salary: string;
  dateOfBirth: string;
  dateOfEntry: string;
  employeeStatusId: number;
  dateOfExit: string;
  responsibleContact: string;
  chargeId: number;
  charge: ICharge;
  branch: Branches;
  branchId: number;
  employeeStatus: EmployeeStatus;
  statusId: number;
  studyLevel: StudyLevel;
  studyLevelId: number;
  contractType: ContractType;
  contractTypeId: number;
  address: Address;
  department: string;
  departmentName: string;
  municipality: string;
  complement: string;
  municipalityName: string;
  addressId: number;
  isActive: boolean;
  isResponsibleCutZ: boolean
}

export interface IGetEmployeesPaginated extends IPagination {
  employees: Employee[];
}

export interface EmployeePayload {
  id?: number;
  branchId: number;
  chargeId: number;
  firstLastName: string;
  secondLastName: string;
  firstName: string;
  secondName: string;
  bankAccount: string;
  nit: string;
  dui: string;
  isss: string;
  phone: string;
  salary: string;
  afp?: string;
  dateOfBirth: string;
  dateOfEntry: string;
  code: string;
  age?: string;
  responsibleContact?: string;
  statusId: number;
  studyLevelId: number;
  contractTypeId: number;
  department: string;
  departmentName: string;
  municipality: string;
  municipalityName: string;
  complement?: string;
  dateOfExit: string;
  isResponsibleCutZ?: boolean
}
export interface GenerateCodeCut {
  codeReferalNote: boolean;
  cutZ: boolean
  codeZValue:string,
  codeReferalNoteValue:string
}
interface Address {
  departamento: string;
  nombreDepartamento: string;
  municipio: string;
  nombreMunicipio: string;
  complemento?: string;
}

export interface GetEmployeeList {
  ok: boolean;
  message: string;
  employees: Employee[];
}

export interface Person {
  birthdays: MonthsAttendance[];
}
export interface MonthsAttendance {
  id: number;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  dateOfBirth: string;
  branchName: string;
}


export interface GetEmployeeByCode {
  ok: boolean;
  message: string;
  employee: Employee;
}

export interface IResponseCodes {
  ok: boolean
  codes: Codes
}

export interface Codes {
  codeCutZ: string
  codeReferal: string
}
