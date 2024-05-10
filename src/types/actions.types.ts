import { IView } from "./view.types";
export interface IAction {
  id: number;
  name: string;
  isActive?: boolean;
  view: IView;
  actionId: number;
}
export interface IActionPayload {
  names: {name: string}[]
  viewId: number
}
export interface IGetActionRol {
  ok: boolean;
  actionsId: IAction[];
}