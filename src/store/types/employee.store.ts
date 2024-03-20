import {
  Employee,
  EmployeePayload,
  IGetEmployeesPaginated,
} from "../../types/employees.types";

export interface IEmployeeStore {
  employee_paginated: IGetEmployeesPaginated;
  employee_list: Employee[];
  saveEmployeesPaginated: (employee_paginated: IGetEmployeesPaginated) => void;
  getEmployeesPaginated: (
    page: number,
    limit: number,
    fullName: string,
    branch: string,
    phone: string
  ) => void;
  postEmployee: (payload: EmployeePayload) => Promise<boolean>;
  patchEmployee: (payload: EmployeePayload, id: number) => Promise<boolean>;
  deleteEmployee: (id: number) => Promise<boolean>;
  getEmployeesList: () => void;
}
