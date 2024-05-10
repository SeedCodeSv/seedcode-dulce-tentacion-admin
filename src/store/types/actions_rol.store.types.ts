import { IActionPayload, IAction } from "../../types/actions.types";
export interface IActionsRolStore {
  actions_by_view_and_rol: string[];
  actions_view: IAction[];

  getActionsByRolView: (idRol: number, idView: number) => void;
  OnCreateActionsRol: (payload: IActionPayload, roleId: number) => Promise<boolean>;

}
