import axios from "axios";
import { Cat019CodigoActividadEconomica } from "../../types/billing/cat-019-codigo-de-actividad-economica.types";
import { FACTURACION_API } from "../../utils/constants";

export const cat_019_codigo_de_actividad_economica = () => {
  return axios.get<Cat019CodigoActividadEconomica>(
    FACTURACION_API + "/cat-019-codigo-de-actividad-economica"
  );
};
