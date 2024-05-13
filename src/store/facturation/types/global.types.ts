import { Departamento } from "../../../types/billing/cat-012-departamento.types";
import { Municipio } from "../../../types/billing/cat-013-municipio.types";
import { CodigoActividadEconomica } from "../../../types/billing/cat-019-codigo-de-actividad-economica.types";
import {IAmbienteDestino} from "../../../types/DTE/ambiente_destino.types"
import { DteJson } from "../../../types/DTE/credito_fiscal.types";
import {IFormasDePago} from "../../../types/DTE/forma_de_pago.types"
import {ITipoDocumento} from "../../../types/DTE/tipo_documento.types"
import {TipoTributo} from "../../../types/DTE/tipo_tributo.types"

export interface IGlobalBillingStore {
  cat_012_departamento: Departamento[];
  cat_013_municipios: Municipio[];
  cat_019_codigo_de_actividad_economica: CodigoActividadEconomica[];
  getCat012Departamento: () => void;
  getCat013Municipios: () => void;
  getCat019CodigoActividadEconomica: () => void;
  //-----------------------------------
  ambiente_destino: IAmbienteDestino[];
  metodos_de_pago: IFormasDePago[]
  tipos_de_documento: ITipoDocumento[]
  tipos_tributo: TipoTributo[]

  OnGetTiposTributos: ()=> void
  OnGetTipoDeDocumento: ()=> void
  OnGetFormasDePago: ()=>void
  OnGetAmbienteDestino: () => void;
  OnSignInvoiceDocument: (DTE: DteJson, total: number) => void;
}
