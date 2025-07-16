import { DataBox, IGetCutsReport, IGetCutsReportSummary, SearchCutReport } from "@/types/cashCuts.types";

export interface ICutReportStore {
    cashCutsDetailed: IGetCutsReport;
    cashCutsSummary: IGetCutsReportSummary;
    loadindSummary: boolean;
    loadingDetailed: boolean;
    dataBox: DataBox[];
    loadingDataBox: boolean,
    onGetCashCutReportDetailed: (params: SearchCutReport) => void
    onGetCashCutReportDetailedExport: (params: SearchCutReport) => Promise<{ ok: boolean, cashCutsDetailed: IGetCutsReport }>
    onGetCashCutReportSummary: (params: SearchCutReport) => void
    onGetCashCutReportSummaryExport: (params: SearchCutReport) => Promise<{ ok: boolean, cashCutsSummary: IGetCutsReportSummary }>
    onGetDataBox: (branchId: number, date: string) => void;

}