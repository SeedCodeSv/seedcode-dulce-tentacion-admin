import { Dispatch, SetStateAction } from 'react';
import { Product } from '../../../types/products.types';
import { OrderProductDetail } from '@/types/order-products.types';

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

export interface IMobileOrderProductsComp {
  handleDetails: (data: any) => void
  onAddBydetail: (data: any) => void
  onAddBranchDestiny: (data: any) => void
  onAddOrderId: (id: number) => void
  addSelectedProducts: (data: OrderProductDetail[]) => void
  selectedIds: number[]
  handleCheckboxChange: (id: number) => void
}

export interface IMobileShopping {
  handleVerify: (id: number) => void
  // modalConfirm: () => void
  onDeleteConfirm: (id: number) => void
}

export interface IMobileAddProdcutOrder {
  handlePrint: (index: number) => void
  handleSaveOrder: () => void
}

