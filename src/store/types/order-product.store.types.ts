import { SearchGlobal } from "@/types/global.types"
import { IGetOrdersProducts, IGroupedOrderData, Order, SearchOrders } from "@/types/order-products.types"

export interface OrderProductState {
  orders: Order[]
  ordersProducts: IGetOrdersProducts;
  loading: boolean
  loading_orders: boolean
  getOrdersByBranch: (branchId: number) => void
  getOrdersByDates: (params: SearchGlobal) => void;
getGroupedOrdersExport: (params: SearchOrders) => Promise<{ ok: boolean; orders: IGroupedOrderData }>
}
