export interface CategoryProduct {
    id: number;
    name: string;
    isActive: boolean;
  }
  
  export interface IGetCategoriesPaginated {
    ok: boolean;
    categoryProducts: CategoryProduct[];
    total: number;
    totalPag: number;
    currentPag: number;
    nextPag: number;
    prevPag: number;
    status: number;
  }
  
  export interface IGetCategories {
    ok: boolean;
    message: string;
    categoryProducts: CategoryProduct[];
  }
  