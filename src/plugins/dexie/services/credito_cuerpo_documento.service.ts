import { db } from '../db';
import { CreditoCuerpoDocumento } from '../entities/cuerpo_documento_credito_fiscal';

export const get_credito_cuerpo_documento_by_venta = async (id: number) => {
  return await db.credito_cuerpo_documento.filter((cuerpo) => cuerpo.ventaId === id).toArray();
};

export const add_credito_cuerpo = async (cuerpo: CreditoCuerpoDocumento[]) => {
  return await db.credito_cuerpo_documento.bulkAdd(cuerpo);
};
