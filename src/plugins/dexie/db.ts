import Dexie, { Table } from "dexie";
import { Address } from "./entities/address";
import { Receptor } from "./entities/factura-receptor";
import { Pagos } from "./entities/pagos";
import { CuerpoDocumento } from "./entities/cuerpo_documento";
import { Resumen } from "./entities/resumen";
import { Venta } from "./entities/venta";
//-------------------------------------------------
import { CreditoVenta } from "./entities/credito_venta";
import { CreditoCuerpoDocumento } from "./entities/cuerpo_documento_credito_fiscal";
import { CreditoPagos } from "./entities/pagos_credito_fiscal";
import {CreditoReceptor} from "./entities/credito_fiscal_receptor"
import {AddressCredito} from "./entities/address_credito_fiscal"
import {CreditoResumen} from "./entities/resumen_credito_fiscal"
export class SeedCodeSvDB extends Dexie {
  venta!: Table<Venta>;
  direccion!: Table<Address>;
  factura_receptor!: Table<Receptor>;
  pagos!: Table<Pagos>;
  cuerpo_documento!: Table<CuerpoDocumento>;
  resumen!: Table<Resumen>;
  //----------------------------------------------------------
  credito_venta!: Table<CreditoVenta>;
  credito_cuerpo_documento!: Table<CreditoCuerpoDocumento>
  credito_pagos!: Table<CreditoPagos>;
  credito_receptor!: Table<CreditoReceptor>;
  credito_address!: Table<AddressCredito>;
  credito_resumen!: Table<CreditoResumen>;

  constructor() {
    super("seedcodeERP");
    this.version(1).stores({
      venta: "++id, fecha, total,codigoGeneracion",
      direccion: "++id, departamento, municipio, complemento",
      factura_receptor:
        "++id, tipoDocumento, numDocumento,nrc,nombre,codActividad,descActividad,telefono,correo, addressId, ventaId",
      pagos: "++id, montoPago, referencia, plazo, periodo,ventaId",
      cuerpo_documento:
        "++id, numItem, tipoItem, uniMedida, numeroDocumento, cantidad, codigo, codTributo, descripcion, precioUni, montoDescu, ventaNoSuj, ventaExenta, ventaGravada, ivaItem, tributos, psv, noGravado,ventaId",
      resumen:
        "++id, totalNoSuj, totalExenta, totalGravada, subTotalVentas, descuNoSuj, descuExenta, descuGravada, porcentajeDescuento, totalDescu, tributos, subTotal, ivaRete1, reteRenta, totalIva, montoTotalOperacion, totalNoGravado, totalPagar, totalLetras, saldoFavor, condicionOperacion, numPagoElectronico,ventaId",
      credito_venta: "++id, fecha, total, codigoGeneracion",
      credito_cuerpo_documento:
        "++id, numItem, tipoItem, uniMedida, numeroDocumento, cantidad, codigo, codTributo, descripcion,precioUni, montoDescu, ventaNoSuj, ventaExenta, ventaGravada, ivaItem, psv, noGravado,ventaId",
        credito_pagos: "++id, codigo, montoPago, referencia, plazo,periodo,ventaId",
        credito_receptor: "++id, tipoDocumento, numDocumento,nit,nrc,nombre,codActividad,descActividad,nombreComercial,telefono,correo, addressId, ventaId",
        credito_address: "++id,departamento, municipio, complemento",
        credito_resumen: "++id, totalNoSuj, totalExenta, totalGravada, subTotalVentas, descuNoSuj, descuExenta, descuGravada, porcentajeDescuento, totalDescu, tributos, subTotal, ivaRete1, reteRenta,ivaPerci1,totalIva, montoTotalOperacion, totalNoGravado, totalPagar, totalLetras, saldoFavor, condicionOperacion,pagosId,numPagoElectronico,ventaId",
    });
  }
}

export const db = new SeedCodeSvDB();
