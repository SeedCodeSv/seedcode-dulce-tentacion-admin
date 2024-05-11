import { Role } from "./roles.types";
import { IAction } from "./actions.types";
export interface IActionRol {
  id: number;
  isActivated: boolean;
  role: Role;
  action: IAction;
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