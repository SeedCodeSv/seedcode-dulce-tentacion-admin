import { DataBox, IGetCutsReport, IGetCutsReportSummary, SearchCutReport } from "@/types/cashCuts.types";
import { DataBoxCut } from "@/types/printeCut.types";

export interface ICutReportStore {
    cashCutsDetailed: IGetCutsReport;
    cashCutsSummary: IGetCutsReportSummary;
    loadindSummary: boolean;
    loadingDetailed: boolean;
    dataBox: DataBox[];
    dataBoxes: DataBoxCut[]
    loadingDataBox: boolean,
    onGetCashCutReportDetailed: (params: SearchCutReport) => void
    onGetCashCutReportDetailedExport: (params: SearchCutReport) => Promise<{ ok: boolean, cashCutsDetailed: IGetCutsReport }>
    onGetCashCutReportSummary: (params: SearchCutReport) => void
    onGetCashCutReportSummaryExport: (params: SearchCutReport) => Promise<{ ok: boolean, cashCutsSummary: IGetCutsReportSummary }>
    onGetDataBox: (branchId: number, date: string) => void;
    onGetCuts: (branchId: number, date: string) => void;

}