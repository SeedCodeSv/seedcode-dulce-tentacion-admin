import { AddressCredito } from '../../entities/address_credito_fiscal';
import { CreditoReceptor } from '../../entities/credito_fiscal_receptor';
import { CreditoResumen } from '../../entities/resumen_credito_fiscal';
import { CreditoVenta } from '../../entities/credito_venta';
import { CreditoCuerpoDocumento } from '../../entities/cuerpo_documento_credito_fiscal';
import { CreditoPagos } from '../../entities/pagos_credito_fiscal';
import { SVFE_CF_SEND } from '../../../../types/svf_dte/cf.types';

export interface CreditSaleContingenciaI {
  credito_venta: CreditoVenta;
  credito_receptor: CreditoReceptor;
  credito_address: AddressCredito;
  credito_resumen: CreditoResumen;
  credito_cuerpo_documento: CreditoCuerpoDocumento[];
  credito_pagos: CreditoPagos;
}
export interface IContingenciaCreditoStore {
  createContingenciaCredito: (ISendMHFiscal: SVFE_CF_SEND) => Promise<void>;
  getCreditoVentaByCodigo: (codigo: string) => Promise<CreditSaleContingenciaI | undefined>;
}
