import { IPagination } from '@/types/global.types';
import { ProductionOrder } from '@/types/production-order.types';

export interface ProductionOrderStore {
  productionOrders: ProductionOrder[];
  paginationProductionOrders: IPagination;
  loadingProductionOrders: boolean;
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
