export interface salesStore {
  postSales: (
    pdf: string,
    dte: string,
    cajaId: number,
    codigoEmpleado: string,
    sello: string
  ) => void;
}
