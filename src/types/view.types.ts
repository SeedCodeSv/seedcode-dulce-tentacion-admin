export interface IView {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
}
export interface IGetViews {
  views: IView[];
  ok: boolean;
}
