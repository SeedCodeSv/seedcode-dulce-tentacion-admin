import { TipoDeItem } from '../../types/billing/cat-011-tipo-de-item.types';
import {
  IGetProductsPaginated,
  Product,
  ProductAndRecipe,
  ProductPayload,
  Recipe,
} from '../../types/products.types';

import { IPagination } from '@/types/global.types';

export interface IProductsStore {
  products_list: Product[];
  productsFilteredList: Product[];
  cat_011_tipo_de_item: TipoDeItem[];
  loading_products: boolean;
  paginated_products: IGetProductsPaginated;
  recipeBook: Recipe | null;
  loadingRecipeBook: boolean;
  loadingProductsDetails: boolean;
  productsDetails: Product | null;
  productsAndRecipe: ProductAndRecipe[];
  productsAndRecipeLoading: boolean;
  productsAndRecipePagination: IPagination;
  getRecipeBook: (id: number) => void;
  savePaginatedProducts: (products: IGetProductsPaginated) => void;
  getPaginatedProducts: (
    page: number,
    limit: number,
    category: number,
    subCategary: number,
    name: string,
    code: string,
    active?: number
  ) => void;
  getPaginatedProductsAndRecipe: (
    page: number,
    limit: number,
    category: number,
    subCategary: number,
    name: string,
    code: string,
    active: number,
    typeProduct: string
  ) => void;
  getCat011TipoDeItem: () => void;
  postProducts: (payload: ProductPayload) => Promise<void>;
  patchProducts: (payload: ProductPayload, id: number) => Promise<{ ok: boolean }>;
  deleteProducts: (id: number) => void;
  activateProduct: (id: number) => Promise<void>;
  getListProductsList: () => void;
  getProductsDetails: (id: number) => void;
  getProductsFilteredList: (params: {productName?: string }) => void;
}
