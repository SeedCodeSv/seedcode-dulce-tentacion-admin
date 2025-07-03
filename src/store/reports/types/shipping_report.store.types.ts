import { ShippingReport } from '@/services/reports/shipping_report.service';

export interface IShippingReport {
  dataReport: ShippingReport[];
  loading: boolean;
  getShippingReport: (startDate: string, endDate: string) => void;
}
