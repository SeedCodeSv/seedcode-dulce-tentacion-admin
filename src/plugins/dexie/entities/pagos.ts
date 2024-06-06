export interface Pagos {
  id?: number;
  codigo: string;
  montoPago: number;
  referencia: string;
  plazo: string;
  periodo: number;
  ventaId: number;
}
