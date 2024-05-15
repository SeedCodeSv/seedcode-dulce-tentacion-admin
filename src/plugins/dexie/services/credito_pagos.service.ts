import { db } from "../db"
import { CreditoPagos } from "../entities/pagos_credito_fiscal"

export const get_credito_pagos_por_id = async (id: number) => {
    return await db.credito_pagos.filter(pago => pago.ventaId === id).first()
}

export const add_credito_pagos = async (pagos: CreditoPagos) => {
    const id = await db.credito_pagos.add(pagos)

    return await db.credito_pagos.get(id)
}