export interface GetProductionOrderTypes {
    ok: boolean
    productionOrderTypes: ProductionOrderType[]
    status: number
  }
  
  export interface ProductionOrderType {
    id: number
    name: string
    isActive: boolean
  }
  