import axios from "axios"
import { IGetTiposDeContingencia } from "../../types/billing/cat-005-tipos-de-contigencia.types"
import { FACTURACION_API } from '../../utils/constants';

export const get_tipos_de_contingencia = async () => {
    const newLocal = FACTURACION_API + "/cat-005-tipo-de-contingencia"
    return axios.get<IGetTiposDeContingencia>(newLocal)
}