export interface ITipoDocumentoDeReceptor {
  id: number;
  codigo: string;
  valores: string;
  isActivated: boolean;
}

export interface IGetTiposDocumentoDeReceptor {
  ok: boolean;
  message: string;
  status: number;
  objects: ITipoDocumentoDeReceptor[];
}
