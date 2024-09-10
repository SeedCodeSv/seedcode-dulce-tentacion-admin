import {
    BranchPointOfSale,
    IGetPointOfSalePaginated,
    PayloadPointOfSales,
    PointOfSale,
    PointOfSalePayload,

  } from '@/types/point-of-sales.types';
  
  export interface PointOfSalesStore {
    point_of_sales: PointOfSale[];
    loading_point_of_sales: boolean;
    loading_point_of_sales_list: boolean;
    point_of_sales_list: BranchPointOfSale;
    paginated_point_of_sales: IGetPointOfSalePaginated;
    getPointOfSales: (branchId: number) => void;
    postPointOfSales: (paylad: PointOfSalePayload) => Promise<boolean>;
    getPointOfSalesList: (branchId: number) => Promise<void>;
    patchPointOfSales: (paylad: PayloadPointOfSales, id: number) => Promise<boolean>;
    getPaginatedPointOfSales: (
      Transmitter: number,
      page: number,
      limit: number,
      posCode: string,
      branch: string,
      dteType: string
    ) => void;
  }
  