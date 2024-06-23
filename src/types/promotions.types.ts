export interface IGetPromotions {
  ok: boolean;
  message: string;
  promotions: Promotion[];
}

export interface Promotion {
  name: string;
  description: string;
  days: string;
  percentage: number;
  fixedPrice: number;
  startDate: string | Date;
  endDate: string | Date;
  price: number;
  operatorPrice: string;
  state?: boolean;
  isActive?: boolean;
  priority: string;
  branchId: number;
  branches?: {
    id: number;
    name: string;
  };
}
export interface PromotionCategories {
  name: string;
  description: string;
  days: string;
  // quantity: number;
  percentage: number;
  // operator: string;
  fixedPrice: number;
  // maximum: number;
  startDate: string | Date;
  endDate: string | Date;
  price: number;
  operatorPrice: string;
  state?: boolean;
  isActive?: boolean;
  priority: string;
  branchId: number;
  typePromotion: string;
  categories: CategoryProduct[];
}
export interface CategoryProduct {
  categoryId: number;
}

export interface PromotionProducts {
  name: string;
  description: string;
  days: string;
  // quantity: number;
  percentage: number;
  // operator: string;
  fixedPrice: number;
  // maximum: number;
  startDate: string;
  endDate: string;
  price: number;
  operatorPrice: string;
  state?: boolean;
  isActive?: boolean;
  priority: string;
  branchId: number;
  typePromotion: string;
  products: Products[];
}

export interface PromotionPayload {
  name: string;
  description: string;
  days: string;
  // quantity: number;
  percentage: number;
  // operator: string;
  fixedPrice: number;
  // maximum: number;
  startDate: string | Date;
  endDate: string | Date;
  price: number;
  operatorPrice: string;
  state?: boolean;
  isActive?: boolean;
  branchId: number;
  priority: string;
  // typePromotion: string;
}


export interface GroupedPromotions {
  id: number;
  name: string;
  description: string;
  days: string;
  quantity: number;
  percentage: string;
  operator: string;
  fixedPrice: string;
  maximum: number;
  startDate: string;
  endDate: string;
  price: number;
  operatorPrice: string;
  typePromotion: string;
  state: true;
  isActive: true;
  priority: string;
  branch: {
    id: number;
    name: string;
    address: string;
    phone: string;
    isActive: boolean;
    transmitterId: number;
  };
  branchId: number;
}




export interface PromotionProduct {
  name: string;
  description: string;
  days: string;
  quantity: number;
  percentage: number;
  operator: string;
  fixedPrice: number;
  maximum: number;
  startDate: string | Date;
  endDate: string | Date;
  price: number;
  operatorPrice: string;
  state?: boolean;
  isActive?: boolean;
  priority: string;
  branchId: number;
  typePromotion: string;
  products: Products[];
}
export interface Products {
  productId: number;
}
