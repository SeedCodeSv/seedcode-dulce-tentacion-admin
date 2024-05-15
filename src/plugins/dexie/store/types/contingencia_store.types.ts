import { DteJson } from "../../../../types/DTE/DTE.types";
import { Address } from "../../entities/address";
import { CuerpoDocumento } from "../../entities/cuerpo_documento";
import { Receptor } from "../../entities/factura-receptor";
import { Pagos } from "../../entities/pagos";
import { Resumen } from "../../entities/resumen";
import { Venta } from "../../entities/venta";

export interface SaleContingenciaI{
    venta: Venta,
    receptor: Receptor,
    direccion_receptor: Address,
    resumen: Resumen,
    cuerpo_documento: CuerpoDocumento[]
    pagos:Pagos,
}

export interface IContingenciaStore{
    createContingencia: (DteJson: DteJson) => Promise<void>,
    getVentaByCodigo: (codigo: string) => Promise<SaleContingenciaI | undefined>
}
