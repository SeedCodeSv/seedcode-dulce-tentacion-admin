import { IView } from "../../types/view.types";
export interface ViewsStore {
    views_list: IView[];
    found: string[];
    getViews: () => void;
}