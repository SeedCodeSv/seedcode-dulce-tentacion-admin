import { db } from '../db';
import { Address } from '../entities/address';

export const get_address_by_id = async (id: number) => {
  return await db.direccion.filter((address) => address.id === id).first();
};

export const add_address = async (address: Address) => {
  const id = await db.direccion.add(address);
  return await db.direccion.get(id);
};
