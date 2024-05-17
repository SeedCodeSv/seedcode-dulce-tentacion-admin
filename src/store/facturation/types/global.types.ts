import { ITiposDeContingencia } from "../../../types/billing/cat-005-tipos-de-contigencia.types";
import { Departamento } from "../../../types/billing/cat-012-departamento.types";
import { Municipio } from "../../../types/billing/cat-013-municipio.types";
import { IUnitOfMeasurement } from "../../../types/billing/cat-014-tipos-de-medida.types";
import { CodigoActividadEconomica } from "../../../types/billing/cat-019-codigo-de-actividad-economica.types";
import {IAmbienteDestino} from "../../../types/DTE/ambiente_destino.types"
import {IFormasDePago} from "../../../types/DTE/forma_de_pago.types"
import {ITipoDocumento} from "../../../types/DTE/tipo_documento.types"
import {TipoTributo} from "../../../types/DTE/tipo_tributo.types"

export interface IGlobalBillingStore {
  cat_012_departamento: Departamento[];
  cat_013_municipios: Municipio[];
  cat_019_codigo_de_actividad_economica: CodigoActividadEconomica[];
  cat_005_tipo_de_contingencia: ITiposDeContingencia[];
  cat_014_unidad_de_medida: IUnitOfMeasurement[];
  getCat005TipoDeContingencia: () => void;
  getCat012Departamento: () => void;
  getCat013Municipios: () => void;
  getCat014UnidadDeMedida: () => void;
  getCat019CodigoActividadEconomica: () => void;
  //-----------------------------------
  ambiente_destino: IAmbienteDestino[];
  metodos_de_pago: IFormasDePago[];
  tipos_de_documento: ITipoDocumento[];
  tipos_tributo: TipoTributo[];

  OnGetTiposTributos: () => void;
  getCat02TipoDeDocumento: () => void;
  getCat017FormasDePago: () => void;
  OnGetAmbienteDestino: () => void;
}
