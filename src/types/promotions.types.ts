export interface IGetPromotions {
  ok: boolean;
  message: string;
  promotions: Promotion[];
}

export interface Promotion {
  name: string;
  description: string;
  days: string;
  quantity: number;
  percentage: number;
  operator: string;
  fixedPrice: number;
  maximum: number;
  startDatestring: string;
  price: number;
  operatorPrice: string;
  state: boolean;
  isActive: boolean;
  products: {
    productId: number;
  };
  branches: {
    branchId: number;
  };
  categories: {
    categoryId: number;
  };
}
