import { BranchProduct } from '../branch_products.types';
import { IPagination } from '../global.types';

export enum TypeOfMovements {
  Entries = 'Entradas',
  Exits = 'Salidas',
}

export interface IReportKardex extends IPagination {
  ok: boolean;
  data: Kardex[];
  status: number;
}

export interface Kardex {
  productName: string;
  productCode: string;
  productPrice: string;
  quantity: string;
  entries: number;
  exits: number;
  price: string;
  cost: string;
  utility: number;
  profitability: number;
}

export interface IResponseDetailsByProduct {
  ok: boolean;
  details: IDetaiLAdjustment[];
  status: number;
}

export interface IDetaiLAdjustment {
  id: number;
  previousStock: string;
  remainingStock: string;
  previousPrice: string;
  remainingPrice: string;
  quantity: string;
  typed: string;
  isActive: boolean;
  branchProduct: BranchProduct;
  inventoryAdjustmentId: number;
  branchProductId: number;
}

export interface IReportKardexByProduct extends IPagination {
  ok: boolean;
  initialStock: number,
  totalEntradas: number,
  totalSalidas: number,
  productName: string
  movements: KardexByProduct[];
  stockActual: number
  status: number;
}

export interface IReportKardexAllProduct {
  ok: boolean;
  status: number;
  data: {
    [key: string]: {
      id: number;
      name: string;
      items: KardexByProduct[];
    };
  };
}

export interface KardexByProduct {
  id: number;
  typeOfMovement: string;
  typeOfInventory: string;
  quantity: number;
  initialStock: number
  finalStock: number
  date: string;
  time: string;
  totalMovement: string;
  isActive: boolean;
  branchProduct: BranchProduct;
  saldoActual: number
  branchProductId: number;
}


export interface IReportKardexGeneral {
  ok: boolean;
  data: DataKardex[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface DataKardex {
  date: string;
  time: string;
  movementType: string;
  inventoryType: string;
  productName: string;
  productCode: string;
  branchName: string;
  quantity: number;
  unitCost: number;
  totalMovement: number;
  initialStock: number
}
