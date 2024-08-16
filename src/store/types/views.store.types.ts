import {
  IResponseDataViewasAction,
  IView,
  IViewPayload,
  ViewasAction,
} from '../../types/view.types';
export interface ViewsStore {
  pagination_actions: IResponseDataViewasAction;
  views_list: IView[];
  viewasAction: ViewasAction[];
  founds: string[];
  views: IView[];
  getViews: () => void;
  OnGetViewasAction: (
    page?: number,
    limit?: number,
    name?: string
  ) => Promise<IResponseDataViewasAction>;
  loading_views: boolean;

  OnGetViews: () => void;
  OnCreateView: (views: IViewPayload[]) => Promise<boolean>;
  OnDeleteView: (id: number) => Promise<boolean>;
}
