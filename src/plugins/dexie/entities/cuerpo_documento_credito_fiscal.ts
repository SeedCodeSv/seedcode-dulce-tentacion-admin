export interface CreditoCuerpoDocumento {
  id?: number;
  numItem: number;
  tipoItem: number;
  uniMedida: number;
  numeroDocumento: string | null;
  cantidad: number;
  codigo: string;
  codTributo: string | null;
  descripcion: string;
  precioUni: number;
  montoDescu: number;
  ventaNoSuj: number;
  ventaExenta: number;
  ventaGravada: number;
  psv: number;
  noGravado: number;
  ivaItem: number;
  ventaId: number;
}
