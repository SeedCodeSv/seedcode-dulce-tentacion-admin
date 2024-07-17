import { Customer } from "../../../types/customers.types";

export interface MobileViewProps {
    layout: 'grid' | 'list';
    actions : string[]
    deletePopover: ({ customers }: { customers: Customer }) => JSX.Element;
    handleChangeCustomer: (customer: Customer, type: string) => void;
    handleActive: (id: number) => void;
}

export interface GridProps {
    customers: Customer,
    layout: 'grid' | 'list',
    handleChangeCustomer: (customer: Customer, type: string) => void,
    handleActive: (id: number) => void
    actions : string[]
}