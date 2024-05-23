export interface CreditoPagos {
  id?: number;
  codigo: string;
  montoPago: number;
  referencia: string;
  plazo?: string | null;
  periodo?: string | null;
  ventaId: number;
}
