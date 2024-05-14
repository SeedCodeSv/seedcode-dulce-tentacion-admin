import { db } from "../db";
import { CuerpoDocumento } from "../entities/cuerpo_documento";

export const get_cuerpo_documento_by_venta = async (id: number) => {
    return await db.cuerpo_documento.filter(cuerpo => cuerpo.ventaId === id).toArray()
}

export const add_cuerpo = async (cuerpo: CuerpoDocumento[]) => {
    return  await db.cuerpo_documento.bulkAdd(cuerpo)
}