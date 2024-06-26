import { EmployeeStatus } from "../../types/employee_status.types";

export interface IEmployeeStatusStore{
    employee_status: EmployeeStatus[];
    GetEmployeeStatus: () => void;
}