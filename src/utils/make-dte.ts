import { DteJson } from '../types/DTE/credito_fiscal.types';
import { ITransmitter } from '../types/transmitter.types';
import { Customer } from '../types/customers.types';
import { ResponseMHSuccess } from '../types/DTE/contingencia.types';
import { ISendMHFiscal } from '../types/DTE/credito_fiscal.types';
import { ICartProduct } from '../types/branch_products.types';
import { FC_CuerpoDocumentoItems } from '../types/svf_dte/fc.types';

import { convertCurrencyFormat } from './money';

export const generate_emisor = (transmitter: ITransmitter) => {
  return {
    nit: transmitter.nit,
    nrc: transmitter.nrc,
    nombre: transmitter.nombre,
    nombreComercial: transmitter.nombreComercial,
    codActividad: transmitter.codActividad,
    descActividad: transmitter.descActividad,
    tipoEstablecimiento: transmitter.tipoEstablecimiento,
    direccion: {
      departamento: transmitter.direccion.departamento,
      municipio: transmitter.direccion.municipio,
      complemento: transmitter.direccion.complemento,
    },
    telefono: transmitter.telefono,
    correo: transmitter.correo,
    codEstable: transmitter.codEstable,
    codEstableMH: transmitter.codEstableMH === '0' ? null : transmitter.codEstableMH,
    codPuntoVenta: transmitter.codPuntoVenta,
    codPuntoVentaMH: transmitter.codPuntoVentaMH === '0' ? null : transmitter.codPuntoVentaMH,
  };
};

export const make_cuerpo_documento = (products_cart: ICartProduct[]): FC_CuerpoDocumentoItems[] => {
  return products_cart.map((cp, index) => {
    return {
      numItem: index + 1,
      tipoItem: 1,
      uniMedida: Number(26),
      numeroDocumento: null,
      cantidad: cp.quantity,
      codigo: null,
      codTributo: null,
      descripcion: cp.product.name,
      precioUni:
        Number(cp.price) < Number(cp.base_price) ? Number(cp.base_price) : Number(cp.price),
      montoDescu: Number(cp.discount.toFixed(2)),
      ventaNoSuj: 0,
      ventaExenta: 0,
      ventaGravada: Number((cp.quantity * Number(cp.price)).toFixed(2)),
      ivaItem: Number(get_iva(Number(cp.price), cp.quantity).toFixed(2)),
      tributos: null,
      psv: 0,
      noGravado: 0,
    };
  });
};

export const get_iva = (price: number, quantity: number) => {
  const total = Number(price) * Number(quantity);

  const iva = total / 1.13;

  return total - iva;
};

export function formatearNumero(numero: number): string {
  const numeroFormateado: string = numero.toString().padStart(15, '0');

  return numeroFormateado;
}

export const make_to_pdf = (DTE: DteJson, total: number, data: ResponseMHSuccess) => {
  return {
    emisor: DTE.dteJson.emisor,
    receptor: DTE.dteJson.receptor,
    resumen: {
      ...DTE.dteJson.resumen,
      totalNoSuj: Number(DTE.dteJson.resumen.totalNoSuj).toFixed(2),
      totalExenta: Number(DTE.dteJson.resumen.totalExenta).toFixed(2),
      totalGravada: Number(DTE.dteJson.resumen.totalGravada).toFixed(2),
      subTotalVentas: Number(DTE.dteJson.resumen.subTotalVentas).toFixed(2),
      descuNoSuj: Number(DTE.dteJson.resumen.descuNoSuj).toFixed(2),
      descuExenta: Number(DTE.dteJson.resumen.descuExenta).toFixed(2),
      descuGravada: Number(DTE.dteJson.resumen.descuGravada).toFixed(2),
      porcentajeDescuento: Number(DTE.dteJson.resumen.porcentajeDescuento).toFixed(2),
      totalDescu: Number(DTE.dteJson.resumen.totalDescu).toFixed(2),
      tributos: null,
      subTotal: Number(DTE.dteJson.resumen.subTotal).toFixed(2),
      ivaRete1: Number(DTE.dteJson.resumen.ivaRete1).toFixed(2),
      reteRenta: Number(DTE.dteJson.resumen.reteRenta).toFixed(2),
      totalIva: Number(DTE.dteJson.resumen.totalIva).toFixed(2),
      montoTotalOperacion: Number(DTE.dteJson.resumen.montoTotalOperacion).toFixed(2),
      totalNoGravado: Number(DTE.dteJson.resumen.totalNoGravado).toFixed(2),
      totalPagar: Number(DTE.dteJson.resumen.totalPagar).toFixed(2),
      totalLetras: convertCurrencyFormat(String(total.toFixed(2))),
      saldoFavor: 0,
    },
    codigoGeneracion: data.codigoGeneracion,
    version: data.version,
    ambiente: data.ambiente,
    versionApp: data.versionApp,
    estado: data.estado,
    selloRecibido: data.selloRecibido,
    fhProcesamiento: data.fhProcesamiento,
    clasificaMsg: data.clasificaMsg,
    codigoMsg: data.codigoMsg,
    descripcionMsg: data.descripcionMsg,
    observaciones: data.observaciones,
    numeroControl: DTE.dteJson.identificacion.numeroControl,
    cuerpoDocumento: make_cuerpo_documento_pdf(DTE),
  };
};

export const make_cuerpo_documento_pdf = (DTE: DteJson) => {
  return DTE.dteJson.cuerpoDocumento.map((item) => {
    return {
      ...item,
      montoDescu: Number(item.montoDescu).toFixed(2),
      ventaNoSuj: Number(item.ventaNoSuj).toFixed(2),
      ventaExenta: Number(item.ventaExenta).toFixed(2),
      ventaGravada: Number(item.ventaGravada).toFixed(2),
      ivaItem: Number(0).toFixed(2),
      psv: Number(item.psv).toFixed(2),
      noGravado: Number(item.noGravado).toFixed(2),
    };
  });
};

export const return_pdf_file = (uri: string, savedDTE: DteJson) => {
  return JSON.parse(
    JSON.stringify({
      uri: uri,
      name: savedDTE.dteJson.identificacion.numeroControl + '.pdf',
      type: 'application/pdf',
    })
  );
};
export const return_json_file = (uri: string, savedDTE: DteJson) => {
  return JSON.parse(
    JSON.stringify({
      uri: uri,
      name: savedDTE.dteJson.identificacion.numeroControl + '.json',
      type: 'application/json',
    })
  );
};

export const return_pdf_file_fiscal = (uri: string, savedDTE: ISendMHFiscal) => {
  return JSON.parse(
    JSON.stringify({
      uri: uri,
      name: savedDTE.dteJson.identificacion.numeroControl + '.pdf',
      type: 'application/pdf',
    })
  );
};
export const return_json_file_fiscal = (uri: string, savedDTE: ISendMHFiscal) => {
  return JSON.parse(
    JSON.stringify({
      uri: uri,
      name: savedDTE.dteJson.identificacion.numeroControl + '.json',
      type: 'application/json',
    })
  );
};

// export const generate_receptor = (value: Customer) => {
//   return {
//     tipoDocumento:
//       value!.tipoDocumento === '0' || value.tipoDocumento === 'N/A' ? null : value!.tipoDocumento,
//     numDocumento:
//       value!.numDocumento === '0' || value.numDocumento === 'N/A' ? null : value!.numDocumento,
//     nrc: Number(value!.nrc) === 0 ? null : value!.nrc,
//     nombre: value!.nombre,
//     codActividad: Number(value!.codActividad) === 0 ? null : value!.codActividad,
//     descActividad: Number(value!.descActividad) === 0 ? null : value!.descActividad,
//     direccion: {
//       departamento: value!.direccion?.departamento,
//       municipio: value!.direccion?.municipio,
//       complemento: value!.direccion?.complemento,
//     },
//     telefono: value!.telefono,
//     correo: value!.correo,
//   };
// };

export const generate_receptor = (value: Customer) => {
  return {
    tipoDocumento:
      Number(value!.nrc) !== 0 && value!.nrc ? '36' : (value!.tipoDocumento === '0' || value.tipoDocumento === 'N/A' ? null : value!.tipoDocumento),
    numDocumento:
      Number(value!.nrc) !== 0 && value!.nrc ? value!.nit : (value!.numDocumento === '0' || value.numDocumento === 'N/A' ? null : value!.numDocumento),
    nrc: Number(value!.nrc) === 0 ? null : value!.nrc,
    nombre: value!.nombre,
    codActividad: Number(value!.codActividad) === 0 ? null : value!.codActividad,
    descActividad: Number(value!.descActividad) === 0 ? null : value!.descActividad,
    direccion: {
      departamento: value!.direccion?.departamento,
      municipio: value!.direccion?.municipio,
      complemento: value!.direccion?.complemento,
    },
    telefono: value!.telefono,
    correo: value!.correo,
  };
};




export const is_credito_fiscal = (code: string) => {
  return code === '03';
};
