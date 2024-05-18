import { IView, IViewPayload } from "../../types/view.types";
export interface ViewsStore {
    views_list: IView[];
    found: string[];
    getViews: () => void;
    OnCreateView: (views: IViewPayload[]) => Promise<boolean>;
    OnDeleteView: (id: number) => Promise<boolean>;
}