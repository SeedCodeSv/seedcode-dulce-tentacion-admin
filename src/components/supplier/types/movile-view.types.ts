import { Supplier } from "../../../types/supplier.types";


export interface MobileViewProps {
    layout: 'grid' | 'list';
    deletePopover: ({ customers }: { customers: Supplier }) => JSX.Element;
    handleChangeCustomer: (customer: Supplier, type: string) => void;
    handleActive: (id: number) => void;
}

export interface GridProps {
    customers: Supplier,
    layout: 'grid' | 'list',
    handleChangeCustomer: (customer: Supplier, type: string) => void,
    handleActive: (id: number) => void
}