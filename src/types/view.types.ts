import { IPagination } from "./global.types";

export interface IView {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
}
export interface IGetViews {
  views: IView[];
  ok: boolean;
  status: number
}

export interface IViewPayload {
  name: string
}

export interface IGetViewPaginated extends IPagination {
  views: IView[];
}
