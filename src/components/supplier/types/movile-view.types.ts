import { Supplier } from "../../../types/supplier.types";


export interface MobileViewProps {
    layout: 'grid' | 'list';
    deletePopover: ({ supplier }: { supplier: Supplier }) => JSX.Element;
    handleChangeSupplier: (supplier: Supplier, type: string) => void;
    handleActive: (id: number) => void;
}

export interface GridProps {
    supplier: Supplier,
    layout: 'grid' | 'list',
    handleChangeSupplier: (Supplier: Supplier, type: string) => void,
    handleActive: (id: number) => void
    reloadData : (id : number) => void
    onNavigate: (supplier: Supplier) => void; 
}