import { Box } from "../../types/box.types";
export interface IBoxStore {
    box_list: Box[];
    getBoxList: () => void;
}