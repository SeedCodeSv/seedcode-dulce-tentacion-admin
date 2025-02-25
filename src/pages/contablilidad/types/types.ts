import { Dispatch, SetStateAction } from 'react';

export interface Items {
  no: number;
  codCuenta: string;
  descCuenta: string;
  centroCosto?: string;
  descTran: string;
  debe: string;
  haber: string;
  itemId: number;
}

export interface ItemsEdit {
  no: number;
  codCuenta: string;
  descCuenta: string;
  centroCosto?: string;
  descTran: string;
  debe: string;
  haber: string;
  id: number;
}

export interface CodCuentaProps {
  items: Items[];
  setItems: Dispatch<SetStateAction<Items[]>>;
  index: number;
  openCatalogModal: (index: number) => void;
  onClose: () => void;
  isReadOnly?: boolean;
}

export interface CodCuentaPropsEdit {
  items: ItemsEdit[];
  setItems: Dispatch<SetStateAction<ItemsEdit[]>>;
  index: number;
  openCatalogModal: (index: number) => void;
  onClose: () => void;
}

export interface ItemListProps {
  items: Items[];
  openModal: () => void;
  isOpen: boolean;
  setItems: React.Dispatch<React.SetStateAction<Items[]>>;
  getBranchName: (id: number) => string;
}