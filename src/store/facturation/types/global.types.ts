import { Departamento } from "../../../types/billing/cat-012-departamento.types";
import { Municipio } from "../../../types/billing/cat-013-municipio.types";
import { CodigoActividadEconomica } from "../../../types/billing/cat-019-codigo-de-actividad-economica.types";

export interface IGlobalBillingStore {
  cat_012_departamento: Departamento[];
  cat_013_municipios: Municipio[];
  cat_019_codigo_de_actividad_economica: CodigoActividadEconomica[];
  getCat012Departamento: () => void;
  getCat013Municipios: () => void;
  getCat019CodigoActividadEconomica: () => void;
}
