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
  filters: ChangePageParams;
  setFilters: (filters: ChangePageParams) => void
}

export interface IContentBirthday {
  employee: MonthsAttendance[];
}

export interface ChangePageParams {
  page?: number
  name?: string;
  firstLastName?: string;
  branch?: string;
  phone?: string;
  codeEmployee?: string;
  active?: boolean;
  isDate?: boolean;
  startDate?: string;
  endDate?: string;
};
