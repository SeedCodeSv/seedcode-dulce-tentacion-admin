import { Customer } from "@/types/customers.types";

export interface MobileViewProps {
    layout: 'grid' | 'list';
    DeletePopover: ({ customers }: { customers: Customer }) => JSX.Element;
    handleChangeCustomer: (customer: Customer, type: string) => void;
    handleActive: (id: number) => void;
    actions: string[];
}

export interface GridProps {
    customers: Customer,
    layout: 'grid' | 'list',
    handleChangeCustomer: (customer: Customer, type: string) => void,
    handleActive: (id: number) => void
    actions: string[];
    DeletePopover: ({ customers }: { customers: Customer }) => JSX.Element;
}


export interface PropsCustomersModes {
  actions: string[];
  customers: Customer[];
  handleActivate: (id: number) => void;
}