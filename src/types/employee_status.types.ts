export interface EmployeeStatus {
    id: number;
    name: string;
   isActive: boolean;
  }

  export interface IGetEmployeeStatus {
    ok: boolean;
    status: number;
    employeeStatus: EmployeeStatus[];
  }