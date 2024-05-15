import { db } from "../db"
import { Venta } from "../entities/venta"

export const get_venta_by_codigo_generacion = async (codigoGeneracion: string) => {
    return await db.venta.filter(venta => venta.codigoGeneracion === codigoGeneracion).first()
}

export const add_venta = async (venta: Venta) => {
    const id = await db.venta.add(venta)

    return await db.venta.get(id)
}