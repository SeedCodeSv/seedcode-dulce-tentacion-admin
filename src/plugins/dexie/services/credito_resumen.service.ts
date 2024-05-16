import { db } from "../db"
import { CreditoResumen } from "../entities/resumen_credito_fiscal"

export const get_credito_resumen_by_venta = async (id: number) => {
    return await db.credito_resumen.filter(resumen => resumen.ventaId === id).first()
}

export const add_credito_resumen = async (resumen: CreditoResumen) => {
    const id = await db.credito_resumen.add(resumen)
    return await db.credito_resumen.get(id)
}