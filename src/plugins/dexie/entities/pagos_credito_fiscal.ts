export interface CreditoPagos {
  id?: number;
  codigo: string;
  montoPago: number;
  referencia: string;
  plazo?: string | null;
  periodo: number | null;
  ventaId: number;
}
