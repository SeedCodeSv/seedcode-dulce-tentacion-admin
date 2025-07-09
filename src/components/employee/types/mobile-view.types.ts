import { UseDisclosureProps } from '@heroui/react';
import { Dispatch, SetStateAction } from 'react';

import { Employee, IResponseCodes, MonthsAttendance } from '../../../types/employees.types';

export interface IMobileView {
  DeletePopover: ({ employee }: { employee: Employee }) => JSX.Element;
  openEditModal: (employee: Employee) => void;
  actions: string[];
  handleActivate: (id: number) => void;
  generateCodeModal: UseDisclosureProps
  setSelectedId: Dispatch<SetStateAction<number>>
  setSelectedEmployee: Dispatch<SetStateAction<Employee | undefined>>
   setCodes: Dispatch<SetStateAction<IResponseCodes | undefined>>
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
