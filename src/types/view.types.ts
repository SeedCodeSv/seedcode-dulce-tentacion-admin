import { ReactNode } from 'react';

import { IPagination } from './global.types';

export interface ArrayAction {
  actions: string[];
}
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
  ok?: boolean;
  status?: number;
  message?: string;
  totalPag: number;
  total: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  viewasAction?: ViewasAction[];
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

export interface IRespondeActionsData {
  ok: boolean;
  views: View[];
  status: number;
}

export interface View {
  view: View2;
  actions: Actions;
}

export interface View2 {
  name: string;
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
