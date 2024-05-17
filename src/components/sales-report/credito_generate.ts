import { CreditSaleContingenciaI } from "../../plugins/dexie/store/types/contingencia_credito_store.types";
import {
  CreditSale,
} from "../../types/DTE/sub_interface/credito_contingencia";
// import { ISendMHFiscal as ICredito } from "../../types/DTE/DTE.types";
import { ITransmitter } from "../../types/transmitter.types";
import { ambiente } from "../../utils/constants";
// import { ISendMHFiscal } from "../../types/DTE/credito_fiscal.types";
import { ISendMHFiscal as ICredito } from "../../types/DTE/credito_fiscal.types";

export const generateCredit = (
  info: CreditSaleContingenciaI,
  emisor: ITransmitter,
  sale: CreditSale
): ICredito => {
  return {
    nit: emisor.nit,
    activo: true,
    passwordPri: emisor.clavePublica,
    dteJson: {
      identificacion: {
        version: 3,
        codigoGeneracion: sale.codigoGeneracion,
        ambiente: ambiente,
        tipoDte: sale.tipoDte,
        numeroControl: sale.numeroControl,
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContin: null,
        tipoMoneda: "USD",
        fecEmi: sale.fecEmi.toString(),
        horEmi: sale.horEmi.toString(),
      },
      documentoRelacionado: null,
      emisor: {
        nit: emisor.nit,
        nrc: emisor.nrc,
        nombre: emisor.nombre,
        nombreComercial: emisor.nombreComercial,
        codActividad: emisor.codActividad,
        descActividad: emisor.descActividad,
        tipoEstablecimiento: emisor.tipoEstablecimiento,
        direccion: {
          departamento: emisor.direccion.departamento,
          municipio: emisor.direccion.municipio,
          complemento: emisor.direccion.complemento,
        },
        telefono: emisor.telefono,
        correo: emisor.correo,
        codEstable: emisor.codEstable,
        codEstableMH: emisor.codEstableMH === "0" ? null : emisor.codEstableMH,
        codPuntoVenta: emisor.codPuntoVenta,
        codPuntoVentaMH: emisor.codPuntoVentaMH === "0"
          ? null
          : emisor.codPuntoVentaMH,
      },
      receptor: {
        nombreComercial: info.credito_receptor!.nombreComercial,
        tipoDocumento: info.credito_receptor!.tipoDocumento === "0" ||
          info.credito_receptor.tipoDocumento === "N/A"
          ? null
          : info.credito_receptor!.tipoDocumento,
        numDocumento: info.credito_receptor!.numDocumento === "0" ||
          info.credito_receptor.numDocumento === "N/A"
          ? null
          : info.credito_receptor!.numDocumento,
        nit: info.credito_receptor!.nit === "0" || info.credito_receptor.nit === "N/A" ? null : info.credito_receptor!.nit,
        nrc: info.credito_receptor!.nrc,
        nombre: info.credito_receptor!.nombre,
        codActividad: Number(info.credito_receptor!.codActividad) === 0
          ? null
          : info.credito_receptor!.codActividad,
        descActividad: Number(info.credito_receptor!.descActividad) === 0
          ? null
          : info.credito_receptor!.descActividad,
        direccion: {
          departamento: "03",
          municipio: info.credito_address!.municipio,
          complemento: info.credito_address.complemento,
        },
        telefono: info.credito_receptor!.telefono,
        correo: info.credito_receptor!.correo,
      },
      otrosDocumentos: null,
      ventaTercero: null,
      cuerpoDocumento: info.credito_cuerpo_documento.map((cuerpo) => {
        return {
          numItem: cuerpo.numItem,
          tipoItem: 1,
          uniMedida: Number(26),
          numeroDocumento: null,
          cantidad: cuerpo.cantidad,
          codigo: null,
          codTributo: null,
          descripcion: cuerpo.descripcion,
          precioUni: cuerpo.precioUni,
          montoDescu: cuerpo.montoDescu,
          ventaNoSuj: 0,
          ventaExenta: 0,
          ventaGravada: cuerpo.ventaGravada,
          // ivaItem: cuerpo.ivaItem,
          tributos: ["20"],
          psv: 0,
          noGravado: 0,
        };
      }),
      resumen: {
        totalNoSuj: 0,
        totalExenta: 0,
        totalGravada: info.credito_resumen.totalGravada,
        subTotalVentas: info.credito_resumen.subTotalVentas,
        descuNoSuj: 0,
        descuExenta: 0,
        descuGravada: 0,
        porcentajeDescuento: info.credito_resumen.porcentajeDescuento,
        totalDescu: info.credito_resumen.totalDescu,
        tributos: [
          {
            codigo: info.credito_resumen.tributos[0].codigo,
            descripcion: info.credito_resumen.tributos[0].descripcion,
            valor: info.credito_resumen.tributos[0].valor,
          },
        ],
        subTotal: info.credito_resumen.subTotal,
        ivaRete1: 0,
        reteRenta: 0,
        // totalIva: info.credito_resumen.totalIva,
        montoTotalOperacion: info.credito_resumen.montoTotalOperacion,
        totalNoGravado: 0,
        totalPagar: info.credito_resumen.totalPagar,
        totalLetras: info.credito_resumen.totalLetras,
        saldoFavor: 0,
        condicionOperacion: 1,
        ivaPerci1: 0,
        pagos: [
          {
            codigo: info.credito_pagos.codigo,
            montoPago: info.credito_pagos.montoPago,
            referencia: "",
            plazo: null,
            periodo: null,
          },
        ],
        numPagoElectronico: null,
      },
      extension: null,
      apendice: null,
    }
  } as unknown as ICredito
};
