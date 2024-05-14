import { db } from "../db"
import { Receptor } from "../entities/factura-receptor"

export const geT_receptor_by_venta = async (id: number) => {
    return await db.factura_receptor.filter(receptor => receptor.ventaId === id).first()
}


export const add_receptor = async (receptor: Receptor) => {
    const id =  await db.factura_receptor.add(receptor)

    return await db.factura_receptor.get(id)
}