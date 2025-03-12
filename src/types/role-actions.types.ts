export interface ActionR {
  name: string;
  hasInRol: boolean;
  id: number;
}

export interface IViewR {
  name: string;
  id: number;
  actions: ActionR[];
}

export interface IView {
  view: IViewR;
}

export interface IRoleAction {
  role: string;
  views: IView[];
}

export interface IGetIRoleAction {
  ok: boolean;
  roleActions: IRoleAction;
  message: string;
}

export interface RoleViewAction {
  name: string;
  roleId: number;
  view: { name: string; actions: { name: string }[] }[];
}