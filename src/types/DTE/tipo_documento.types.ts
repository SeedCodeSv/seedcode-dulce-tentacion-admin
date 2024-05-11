export interface ITipoDocumento {
  id: number;
  codigo: string;
  valores: string;
  isActivated: boolean;
}

export interface IGetTiposDocumento {
  ok: boolean;
  message: string;
  status: number;
  objects: ITipoDocumento[];
}
