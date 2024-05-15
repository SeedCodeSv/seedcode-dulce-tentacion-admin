import { db } from "../db"
import { AddressCredito } from "../entities/address_credito_fiscal"

export const save_address_credito = async (address: AddressCredito) => {
    const id = await db.credito_address.add(address)
    return await db.credito_address.get(id)
}
export const get_address_credito = async (id: number) => {
    return await db.credito_address.filter(address => address.id === id).first()
}