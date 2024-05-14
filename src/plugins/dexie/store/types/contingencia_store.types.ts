import { DteJson } from "../../../../types/DTE/DTE.types";

export interface IContingenciaStore{
    createContingencia: (DteJson: DteJson) => Promise<void>
}