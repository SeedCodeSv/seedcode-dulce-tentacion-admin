import { IPagination } from '@/types/global.types';
import {
  IError,
  IPayloadVerifyProducts,
  ProductionOrder,
  ProductionOrderDetails,
  ProductionOrderDetailsVerify,
  ResponseVerifyProduct,
} from '@/types/production-order.types';

export interface ProductionOrderStore {
  productionOrders: ProductionOrder[];
  paginationProductionOrders: IPagination;
  loadingProductionOrders: boolean;
  loadingProductionOrder: boolean;
  productionOrder: ProductionOrderDetails | null;
  productionOrderDetail: ProductionOrderDetailsVerify | null;
  loadingProductionOrderDetail: boolean;
  errors: IError[];
  verified_product: ResponseVerifyProduct;
  getProductionsOrderDetail: (id: number) => void;
  getProductionsOrder: (id: number) => void;
  getProductionsOrders: (
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    branchId: number,
    status: string,
    employeeId: number,
    productionOrderTypeId: number
  ) => void;
  handleVerifyProduct:(payload: IPayloadVerifyProducts) => Promise<ResponseVerifyProduct>
}
