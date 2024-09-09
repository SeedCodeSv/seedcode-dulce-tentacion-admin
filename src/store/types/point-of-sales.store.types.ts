import {
    IGetPointOfSalePaginated,
    PointOfSale,
    PointOfSalePayload,
  } from '@/types/point-of-sales.types';
  
  export interface PointOfSalesStore {
    point_of_sales: PointOfSale[];
    loading_point_of_sales: boolean;
    paginated_point_of_sales: IGetPointOfSalePaginated;
    getPointOfSales: (branchId: number) => void;
    postPointOfSales: (paylad: PointOfSalePayload) => Promise<boolean>;
    getPaginatedPointOfSales: (
      Transmitter: number,
      page: number,
      limit: number,
      posCode: string,
      branch: string,
      dteType: string
    ) => void;
  }
  