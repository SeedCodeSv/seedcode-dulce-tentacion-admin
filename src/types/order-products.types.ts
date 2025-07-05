import { BranchProduct } from "./branch_products.types"
import { Branches } from "./branches.types"
import { Employee } from "./employees.types"
import { IPagination } from "./global.types"

export interface GetOrderProductsByBranch {
  message: string
  orders: Order[]
  status: number
}

export interface Order {
  id: number
  details: string
  date: string
  time: string
  isActive: boolean
  status: string
  employee: Employee
  branch: Branches
  orderProductDetails: OrderProductDetail[]
  branchId: number
  employeeId: number
}


export interface OrderProductDetail {
  id: number
  quantity: string
  finalQuantitySend: string
  pendingQuantity: string
  stockWhenSend: string
  branchProduct: BranchProduct
  orderProductId: number
  branchProductId: number
  completedRequest: boolean
}

export interface IGetOrdersProducts extends IPagination {
  order_products: Order[];
}

export interface SearchOrders {
  ordersId?: number[];
  branchIds?: number[];
  startDate?: string;
  endDate?: string;
  status?: string
}


export interface Data {
  productName: string;
  [branchName: string]: number | string;
}

export interface IGroupedOrderData {
  ok:           boolean;
  data:         Data[];
  branchTotals: Totals;
}

interface Totals {
    [branchName: string]: number;
}


