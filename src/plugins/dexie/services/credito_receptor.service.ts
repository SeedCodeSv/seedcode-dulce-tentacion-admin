import { db } from "../db"
import { CreditoReceptor } from "../entities/credito_fiscal_receptor"

export const geT_credito_receptor_by_venta = async (id: number) => {
    return await db.credito_receptor.filter(receptor => receptor.ventaId === id).first()
}


export const add_credito_receptor = async (receptor: CreditoReceptor) => {
    const id =  await db.credito_receptor.add(receptor)

    return await db.credito_receptor.get(id)
}