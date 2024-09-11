import { Employee, MonthsAttendance } from '../../../types/employees.types';

export interface IMobileView {
  layout: 'grid' | 'list';
  deletePopover: ({ employee }: { employee: Employee }) => JSX.Element;
  openEditModal: (employee: Employee) => void;
  actions: string[];
  handleActivate: (id: number) => void;
  OpenPdf: (employee: Employee) => void;
}

export interface GridProps extends IMobileView {
  employee: Employee;
}

export interface IPropsSearchEmployee {
  nameEmployee: (name: string) => void;
  phoneEmployee: (phone: string) => void;
  branchName: (name: string) => void;
  codeEmpleyee: (code: string) => void;
  startDate: (date: string) => void;
  endDate: (date: string) => void;
}

export interface IContentBirthday {
  employee: MonthsAttendance[];
}
