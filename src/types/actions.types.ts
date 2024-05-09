import { IView } from "./view.types";
export interface IAction {
  id: number;
  name: string;
  isActive?: boolean;
  view: IView;
  actionId: number;
}
