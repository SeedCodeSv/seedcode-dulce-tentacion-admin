
import { Correlatives } from "../../types/correlatives.types"

export interface ICorrelativesStore {
    list_correlatives: Correlatives[]
    get_correlativesByBranch: (id: number) => void
}
