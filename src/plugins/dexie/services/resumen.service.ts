import { db } from "../db"
import { Resumen } from "../entities/resumen"

export const get_resumen_by_venta = async (id: number) => {
    return await db.resumen.filter(resumen => resumen.ventaId === id).first()
}

export const add_resumen = async (resumen: Resumen) => {
    const id = await db.resumen.add(resumen)
    return await db.resumen.get(id)
}