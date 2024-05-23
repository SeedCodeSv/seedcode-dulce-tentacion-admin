import { db } from '../db';
import { Venta } from '../entities/venta';

export const get_venta_by_codigo_generacion = async (codigoGeneracion: string) => {
  return await db.venta.filter((venta) => venta.codigoGeneracion === codigoGeneracion).first();
};

export const add_venta = async (venta: Venta) => {
  const id = await db.venta.add(venta);

  return await db.venta.get(id);
};

export const delete_venta = async (codigoGeneracion: string) => {
  const venta = await db.venta
    .filter((venta) => venta.codigoGeneracion === codigoGeneracion)
    .first();
  if (venta) {
    const receptor = await db.factura_receptor
      .filter((receptor) => receptor.ventaId === venta.id)
      .first();
    if (receptor) {
      await db.direccion.where({ id: receptor.addressId }).delete();
    }

    await db.factura_receptor.where({ ventaId: venta.id }).delete();
    await db.pagos.where({ ventaId: venta.id }).delete();
    await db.resumen.where({ ventaId: venta.id }).delete();
    await db.venta.where({ id: venta.id }).delete();
  }
};
