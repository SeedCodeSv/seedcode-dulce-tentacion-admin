export interface IActionsRolStore {
  actions_by_view_and_rol: string[];

  getActionsByRolView: (idRol: number, idView: number) => void;
}
