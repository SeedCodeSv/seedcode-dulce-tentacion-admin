import { Dispatch, SetStateAction } from 'react';
import { Product } from '../../../types/products.types';

export interface IMobileView {
  DeletePopover: ({ product }: { product: Product }) => JSX.Element;
  openEditModal: (product: Product) => void;
  actions: string[];
  handleActivate: (id: number) => void;
  handleShowRecipe: (id: number) => void;
  modalConvertOpen?: () => void
}


export interface IMobileViewOrderProducst {
  modalVerifyOrder: () => void
  modalCancelOrder: () => void
  modalCompleteOrder: () => void
  modalMoreInformation: () => void
  setSelectedOrderId: Dispatch<SetStateAction<number>>

}