import { Daum } from '@/services/reports/production_report.service';

export interface IProductionReport {
  dataReport: Daum[];
  loading: boolean;
  getProductioReport: (branchId: number, date: string) => void;
}
