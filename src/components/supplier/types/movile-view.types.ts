import { Supplier } from '../../../types/supplier.types';

export interface MobileViewProps {
  actions: string[];
  DeletePopover: ({ supplier }: { supplier: Supplier }) => JSX.Element;
  // handleChangeSupplier: (supplier: Supplier, type: string) => void;
  handleActive: (id: number) => void;
}

export interface IPropsSearchSupplier {
  nameSupplier: (name: string) => void;
  emailSupplier: (email: string) => void;
  typeSupplier: (type: string) => void;
}
