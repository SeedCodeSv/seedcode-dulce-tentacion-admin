import { Employee, EmployeePayload, IGetEmployeesPaginated } from '../../types/employees.types';

export interface IEmployeeStore {
  employee_paginated: IGetEmployeesPaginated;
  employee_list: Employee[];
  loading_employees: boolean;
  saveEmployeesPaginated: (employee_paginated: IGetEmployeesPaginated) => void;
  getEmployeesPaginated: (
    page: number,
    limit: number,
    firstName: string,
    firstLastName: string,
    branch: string,
    phone: string,
    active?: number
  ) => void;
  postEmployee: (payload: EmployeePayload) => Promise<boolean>;
  patchEmployee: (payload: EmployeePayload, id: number) => Promise<boolean>;
  deleteEmployee: (id: number) => Promise<boolean>;
  getEmployeesList: () => void;
  activateEmployee: (id: number) => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
}
