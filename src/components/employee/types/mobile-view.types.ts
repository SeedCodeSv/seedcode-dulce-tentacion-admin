import { Employee } from "../../../types/employees.types";

export interface IMobileView {
    layout: 'grid' | 'list';
    deletePopover: ({ employee }: { employee: Employee }) => JSX.Element;
    openEditModal: (employee: Employee) => void;
    actions: string[];
    handleActivate: (id: number) => void;
}

export interface GridProps extends IMobileView {
    employee: Employee
}