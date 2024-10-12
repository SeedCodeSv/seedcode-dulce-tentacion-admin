import { Correlatives } from '@/types/correlatives.types';
import { Correlativo } from '../../types/correlatives_dte.types';
import { IPointOfSaleCorrelativo } from '@/types/point-of-sales.types';

export interface ICorrelativesDteStore {
  point_of_sales: Correlatives[],
  getPointOfSales: (branch_id: number) => void;
  getCorrelativesByDte: (transmitter_id: number, dte: string) => Promise<Correlativo | undefined>;
  getCorrelativeByPointOfSaleDte: (
    transmitter_id: number,
    dte: string
  ) => Promise<IPointOfSaleCorrelativo | undefined>
}
