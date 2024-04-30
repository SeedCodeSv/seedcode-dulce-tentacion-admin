import {
  IGetProductsPaginated,
  ProductPayload,
} from "../../types/products.types";

export interface IProductsStore {
  paginated_products: IGetProductsPaginated;
  savePaginatedProducts: (products: IGetProductsPaginated) => void;
  getPaginatedProducts: (
    page: number,
    limit: number,
    category: string,
    name: string
  ) => void;
  postProducts: (payload: ProductPayload) => void;
  patchProducts: (payload: ProductPayload, id:number) => void
  // deleteProducts: (id: number) => Promise<boolean>;
}
