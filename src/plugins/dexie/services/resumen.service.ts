import { db } from "../db"
import { Resumen } from "../entities/resumen"

export const get_pagos_by_venta = async (id: number) => {
    return await db.resumen.filter(resumen => resumen.ventaId === id).first()
}

export const add_pago = async (resumen: Resumen) => {
    const id = await db.resumen.add(resumen)
    return await db.resumen.get(id)
}