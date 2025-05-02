import { Product } from '../../../types/products.types';

export interface IMobileView {
  DeletePopover: ({ product }: { product: Product }) => JSX.Element;
  openEditModal: (product: Product) => void;
  actions: string[];
  handleActivate: (id: number) => void;
  handleShowRecipe: (id: number) => void;
}