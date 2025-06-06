import { SearchGlobal } from "@/types/global.types"
import { IGetOrdersProducts, Order } from "@/types/order-products.types"

export interface OrderProductState {
  orders: Order[]
  ordersProducts: IGetOrdersProducts;
  loading: boolean
  loading_orders: boolean
  getOrdersByBranch: (branchId: number) => void
  getOrdersByDates: (params: SearchGlobal) => void
}
