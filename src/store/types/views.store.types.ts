import { IView, IViewPayload } from "../../types/view.types";
export interface ViewsStore {
    views_list: IView[];
    founds: string[];
    getViews: () => void;
    OnCreateView: (views: IViewPayload[]) => Promise<boolean>;
    OnDeleteView: (id: number) => Promise<boolean>;
}