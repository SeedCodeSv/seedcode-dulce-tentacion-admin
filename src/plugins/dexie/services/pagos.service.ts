import { db } from "../db"
import { Pagos } from "../entities/pagos"

export const get_pagos_por_id = async (id: number) => {
    return await db.pagos.filter(pago => pago.ventaId === id).first()
}

export const add_pagos = async (pagos:Pagos) => {
    const id = await db.pagos.add(pagos)

    return await db.pagos.get(id)
}