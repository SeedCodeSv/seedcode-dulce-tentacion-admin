import { db } from "../db";
import { CreditoVenta } from "../entities/credito_venta";

export const get_credito_venta_by_codigo_generacion = async (
  codigoGeneracion: string
) => {
  return await db.credito_venta
    .filter((venta) => venta.codigoGeneracion === codigoGeneracion)
    .first();
};

export const add_credito_venta = async (venta: CreditoVenta) => {
  const id = await db.credito_venta.add(venta);

  return await db.credito_venta.get(id);
};
export const delete_credito_venta = async (codigoGeneracion: string) => {
  const credito_venta = await db.credito_venta
    .filter((venta) => venta.codigoGeneracion === codigoGeneracion)
    .first();
  if (credito_venta) {
    const credito_receptor = await db.credito_receptor
      .filter((receptor) => receptor.ventaId === credito_venta.id)
      .first();
    if (credito_receptor) {
      await db.credito_address
        .where({ id: credito_receptor.addressId })
        .delete();
    }
    await db.credito_receptor.where({ ventaId: credito_venta.id }).delete();
    await db.credito_pagos.where({ ventaId: credito_venta.id }).delete();
    await db.credito_resumen.where({ ventaId: credito_venta.id }).delete();
    await db.credito_venta.where({ id: credito_venta.id }).delete();
  }
};
