import axios from "axios";
import { FACTURACION_API } from "../../utils/constants";
import { Cat011TipoDeItem } from "../../types/billing/cat-011-tipo-de-item.types";

export const cat_011_tipo_de_item = () => {
  return axios.get<Cat011TipoDeItem>(
    FACTURACION_API + "/cat-011-tipo-de-item"
  );
};
