import { Dispatch, SetStateAction } from 'react';

export interface Items {
  no: number;
  codCuenta: string;
  descCuenta: string;
  centroCosto?: string;
  descTran: string;
  debe: string;
  haber: string;
}

export interface CodCuentaProps {
  items: Items[];
  setItems: Dispatch<SetStateAction<Items[]>>;
  index: number;
  openCatalogModal: (index: number) => void;
  onClose: () => void;
}
