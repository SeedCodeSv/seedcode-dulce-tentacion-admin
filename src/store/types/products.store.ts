import { TipoDeItem } from "../../types/billing/cat-011-tipo-de-item.types";
import {
  IGetProductsPaginated,
  ProductPayload,
} from "../../types/products.types";

export interface IProductsStore {
  cat_011_tipo_de_item: TipoDeItem[];
  paginated_products: IGetProductsPaginated;
  savePaginatedProducts: (products: IGetProductsPaginated) => void;
  getPaginatedProducts: (
    page: number,
    limit: number,
    category: string,
    name: string
  ) => void;
  getCat011TipoDeItem: () => void
  postProducts: (payload: ProductPayload) => void;
  patchProducts: (payload: ProductPayload, id:number) => void
  deleteProducts: (id: number) => void;
}
