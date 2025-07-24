import { Box_Report } from "@/types/box.types";
import { IPagination } from "@/types/global.types";

export interface reportBoxStore {
    paginated_report: IPagination,
    report_boxes: Box_Report[],

    export_box_excell: Box_Report[],
    OnGetExportExcell: (branches: number[], startDate: string, endDate: string) => void
    OnGetPaginatedReportBox: (page: number, limit: number, branches: number[], startDate: string, endDate: string) => void
}