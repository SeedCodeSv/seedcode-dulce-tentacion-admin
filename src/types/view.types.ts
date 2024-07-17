import { ReactNode } from 'react';
import { IPagination } from './global.types';

export interface IView {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
}
export interface IGetViews {
  views: IView[];
  ok: boolean;
  status: number;
}

export interface IViewPayload {
  name: string;
}

export interface IGetViewPaginated extends IPagination {
  views: IView[];
}



export interface IResponseDataViewasAction {
  ok: boolean;
  viewasAction: ViewasAction[];
  status: number;
}

export interface ViewasAction {
  name: string;
  view: View;
  actions: Actions;
}

export interface View {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
}

export interface Actions {
  id: number[];
  name: string[];
}

export interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
  isOpen: boolean;
  onGroupClick: () => void;
}