import { ProductionOrderType } from '@/types/production-order-type.types';

export interface ProductionOrderTypeStore {
  productionOrderTypes: ProductionOrderType[];
  loadingProductionOrderTypes: boolean;
  onGetProductionOrderTypes: () => void;
  onCreateProductionOrderType: (name: string) => Promise<boolean>;
  onUpdateProductionOrderType: (id: number, name: string) => Promise<boolean>;
  onDeleteProductionOrderType: (id: number) => Promise<boolean>;
}
