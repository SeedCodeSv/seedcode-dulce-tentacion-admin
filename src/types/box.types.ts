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
export interface IBoxPayload {
  start: number;
  branchId?: number;
}
export interface IGetBox {
  ok: boolean;
  message: string;
  box: Box;
}
export interface ICloseBox {
  state: string;
  fiftyCents: number;
  fiftyDollars: number;
  fiveCents: number;
  fiveDollars: number;
  hundredDollars?: number;
  oneCents: number;
  oneDollar: number;
  oneDollarCents: number;
  tenCents: number;
  tenDollars: number;
  twentyDollars: number;
  twentyFiveCents: number;
  twoDollars: number;
}
export interface DetailBox {
  id: number;
  oneDollar: number;
  twoDollars: number;
  fiveDollars: number;
  tenDollars: number;
  twentyDollars: number;
  fiftyDollars: number;
  hundredDollars: number;
  oneCents: number;
  fiveCents: number;
  tenCents: number;
  twentyFiveCents: number;
  fiftyCents: number;
  oneDollarCents: number;
  box: Box
  boxId: number
  isActive?: boolean
}
export interface IGetBox {
  ok: boolean;
	detailBox: DetailBox;
	totalExpenses: number;
	totalSales: number;
	boxStart: string;
	totalBox: number;
	totalMoney: number;
	cost: number;
	boxEnd: number;
}
