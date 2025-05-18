import { IPagination } from "@/types/global.types";
import { Innvalidation } from "@/types/Innvalidations.types";

export interface IAnnulationssStore {
    innvalidations: Innvalidation[],
    is_loading: boolean,
    innvalidations_page: IPagination,
    getInnvalidations: (page: number, limit: number, startDate: string, endDate: string, type: string) => void
}