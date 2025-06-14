import { DataBox, IGetCutsReport, IGetCutsReportSummary, SearchCutReport } from "@/types/cashCuts.types";

export interface ICutReportStore {
    cashCutsDetailed: IGetCutsReport;
    cashCutsSummary: IGetCutsReportSummary;
    loadindSummary: boolean;
    loadingDetailed: boolean;
    dataBox: DataBox[];
    loadingDataBox: boolean,
    onGetCashCutReportDetailed: (params: SearchCutReport) => void
    onGetCashCutReportSummary: (params: SearchCutReport) => void
    onGetDataBox: (branchId: number, date: string) => void;

}