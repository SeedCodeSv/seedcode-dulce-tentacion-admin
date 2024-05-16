import { db } from "../db"
import { CreditoVenta } from "../entities/credito_venta"

export const get_credito_venta_by_codigo_generacion = async (codigoGeneracion: string) => {
    return await db.credito_venta.filter(venta => venta.codigoGeneracion === codigoGeneracion).first()
}

export const add_credito_venta = async (venta: CreditoVenta) => {
    const id = await db.credito_venta.add(venta)

    return await db.credito_venta.get(id)
}