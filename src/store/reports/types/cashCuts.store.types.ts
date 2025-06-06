import { IGetCutsReport, IGetCutsReportSummary, SearchCutReport } from "@/types/cashCuts.types";

export interface ICutReportStore {
    cashCutsDetailed: IGetCutsReport;
    cashCutsSummary: IGetCutsReportSummary;
    loadindSummary: boolean;
    loadingDetailed: boolean;
    onGetCashCutReportDetailed: (params: SearchCutReport) => void
    onGetCashCutReportSummary: (params: SearchCutReport) => void

}