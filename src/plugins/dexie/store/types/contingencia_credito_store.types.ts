import { ISendMHFiscal } from "../../../../types/DTE/credito_fiscal.types";

export interface IContingenciaCreditoStore{
    createContingenciaCredito: (ISendMHFiscal: ISendMHFiscal) => Promise<void>
}