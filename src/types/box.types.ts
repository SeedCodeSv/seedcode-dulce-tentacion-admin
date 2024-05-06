import { Branches } from "../types/branches.types";
export interface Box {
  id: number;
  start: number;
  end: number;
  totalSales: number;
  totalExpense: number;
  totalIva: number;
  date: Date;
  time: Date;
  isActive?: boolean;
  branch: Branches;
  branchId: number;
}
export interface IGetBoxList {
  ok: boolean;
  message: string;
  boxes: Box[];
}
