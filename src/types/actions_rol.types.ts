import { Role } from "./roles.types";
import { IAction } from "./actions.types";
export interface IActionRol {
  id: number;
  role: Role;
  action: IAction;
  isActive: boolean;
}
export interface IGetActionRolList {
  ok: boolean;
  roleActions: IActionRol[];
  status: number;
}
export interface IAddActionRol {
  roleId: number,
  actionIds: {
    id: number
  }[];
}

export interface RoleViewAction {
  name: string;
  roleId: number;
  view: {name: string; actions: {name: string}[] } [];
}