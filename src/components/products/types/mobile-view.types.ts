import { Product } from '../../../types/products.types';

export interface IMobileView {
  DeletePopover: ({ product }: { product: Product }) => JSX.Element;
  openEditModal: (product: Product) => void;
  actions: string[];
  handleActivate: (id: number) => void;
}

export interface GridProps extends IMobileView {
  product: Product;
}

export interface IPropsSearchProduct {
  nameProduct: (name: string) => void;
  codeProduct: (code: string) => void;
  categoryProduct: (category: string) => void;
  subCategoryProduct: (subCategory: string) => void;
}
