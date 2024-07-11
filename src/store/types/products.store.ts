import { TipoDeItem } from '../../types/billing/cat-011-tipo-de-item.types';
import { IGetProductsPaginated, Product, ProductPayload } from '../../types/products.types';

export interface IProductsStore {
  products_list: Product[],
  cat_011_tipo_de_item: TipoDeItem[];
  loading_products: boolean;
  paginated_products: IGetProductsPaginated;
  savePaginatedProducts: (products: IGetProductsPaginated) => void;
  getPaginatedProducts: (
    page: number,
    limit: number,
    category: string,
    subCategary: string,
    name: string,
    code: string,
    active?: number
  ) => void;
  getCat011TipoDeItem: () => void;
  postProducts: (payload: ProductPayload) => void;
  patchProducts: (payload: ProductPayload, id: number) => void;
  deleteProducts: (id: number) => void;
  activateProduct: (id: number) => Promise<void>;
  getListProductsList: () => void;
}
