export interface IFormasDePago {
  id: number;
  codigo: string;
  valores: string;
  isActivated: boolean;
}

export interface IGetFormasDePago {
  ok: boolean;
  message: string;
  status: number;
  object: IFormasDePago[];
}
