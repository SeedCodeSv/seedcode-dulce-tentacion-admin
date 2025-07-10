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


export interface IMobileListSales {
  pdfPath: string
  verifyNotes: (id: number) => void
  downloadPDF: (data: any) => void
  handleShowPdf: (id: number, val: string) => void
  downloadJSON: (data: any) => void
  setUnseen: Dispatch<SetStateAction<boolean>>,
  // verifyApplyAnulation: (data: string, fecEmi: string) => void
  isMovil: boolean,
  unseen: boolean,
  notes: {
    debits: number;
    credits: number;
  }
}
