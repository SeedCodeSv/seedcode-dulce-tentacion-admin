export interface CodigoActividadEconomica {
  id: number;
  codigo: string;
  valores: string;
  isActivated: boolean;
}

export interface Cat019CodigoActividadEconomica {
  ok: boolean;
  message: string;
  status: number;
  object: CodigoActividadEconomica[];
}
