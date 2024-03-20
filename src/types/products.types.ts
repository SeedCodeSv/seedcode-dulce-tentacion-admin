export interface CategoryProduct {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  code: string;
  type: string;
  isActive: boolean;
  categoryProduct: CategoryProduct;
  categoryProductId: number;
}

export interface IGetProductsPaginated {
  ok: boolean;
  products: Product[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  code: string;
  type: string;
  categoryProductId: number;
}
