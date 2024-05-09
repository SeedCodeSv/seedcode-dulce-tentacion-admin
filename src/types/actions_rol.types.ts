import { Role } from "./roles.types";
import { IAction } from "./actions.types";
export interface IActionRol {
  id: number;
  isActive: boolean;
  role: Role;
  action: IAction;
}
export interface IGetActionRolList {
  ok: boolean;
  roleActions: IActionRol[];
}
