import { IPagination } from '@/types/global.types';
import {
  ProductionOrder,
  ProductionOrderDetails,
  ProductionOrderDetailsVerify,
} from '@/types/production-order.types';

export interface ProductionOrderStore {
  productionOrders: ProductionOrder[];
  paginationProductionOrders: IPagination;
  loadingProductionOrders: boolean;
  loadingProductionOrder: boolean;
  productionOrder: ProductionOrderDetails | null;
  productionOrderDetail: ProductionOrderDetailsVerify | null;
  loadingProductionOrderDetail: boolean;
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
}
