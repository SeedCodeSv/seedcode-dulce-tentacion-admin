import { IView, IViewPayload } from '../../types/view.types';
export interface ViewsStore {
  views_list: IView[];
  founds: string[];
  views : IView[]
  getViews: () => void;
  OnGetViews : () => void
  OnCreateView: (views: IViewPayload[]) => Promise<boolean>;
  OnDeleteView: (id: number) => Promise<boolean>;
}
