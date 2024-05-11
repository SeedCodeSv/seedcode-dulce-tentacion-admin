export interface TipoTributo {
  id: number;
  codigo: string;
  valores: string;
  isActivated: boolean;
}

export interface IGetTipoTributos {
  ok: boolean;
  message: string;
  status: number;
  object: TipoTributo[];
}
