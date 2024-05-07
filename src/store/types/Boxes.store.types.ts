import { Box, IBoxPayload } from "../../types/box.types";
export interface IBoxStore {
    box_list: Box[];
    current_box: number
    has_current_box: boolean
    getBoxList: () => void;
    postBox: (box: IBoxPayload) => void;
    OnRemoveBox: ()=> void
}