import { IGetCutsReport, SearchCutReport } from "@/types/cashCuts.types";

export interface ICutReportStore {
    cashCutsDetailed: IGetCutsReport;
    loadingDetailed: boolean;
    onGetCashCutReportDetailed: (params: SearchCutReport) => void
}