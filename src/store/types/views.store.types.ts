import { IView, IViewPayload, ViewasAction } from '../../types/view.types';
export interface ViewsStore {
  views_list: IView[];
  viewasAction: ViewasAction[];
  founds: string[];
  views: IView[];
  getViews: () => void;
  OnGetViewasAction: () => void;
  OnGetViews: () => void;
  OnCreateView: (views: IViewPayload[]) => Promise<boolean>;
  OnDeleteView: (id: number) => Promise<boolean>;
}
