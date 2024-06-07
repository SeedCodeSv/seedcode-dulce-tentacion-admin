import { CreditSaleContingenciaI } from '../../plugins/dexie/store/types/contingencia_credito_store.types';
import { CreditSale } from '../../types/DTE/sub_interface/credito_contingencia';
import { ITransmitter } from '../../types/transmitter.types';
import { ambiente } from '../../utils/constants';
import { Sale } from '../../types/report_contigence';
import { SVFE_CF_SEND } from '../../types/svf_dte/cf.types';

export const generateCredit = (
  info: CreditSaleContingenciaI,
  emisor: ITransmitter,
  sale: CreditSale,
  saleCustomer?: Sale
): SVFE_CF_SEND => {
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
        tipoMoneda: 'USD',
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
        codEstableMH: emisor.codEstableMH === '0' ? null : emisor.codEstableMH,
        codPuntoVenta: emisor.codPuntoVenta,
        codPuntoVentaMH: emisor.codPuntoVentaMH === '0' ? null : emisor.codPuntoVentaMH,
      },
      receptor: {
        nombreComercial: saleCustomer
          ? saleCustomer.customer.nombreComercial
          : info.credito_receptor!.nombreComercial,
        // tipoDocumento:
        //   info.credito_receptor!.tipoDocumento === '0' ||
        //   info.credito_receptor.tipoDocumento === 'N/A'
        //     ? null
        //     : info.credito_receptor!.tipoDocumento,
        // numDocumento: saleCustomer
        //   ? saleCustomer.customer.numDocumento
        //   : info.credito_receptor!.numDocumento === "0" ||
        //     info.credito_receptor.numDocumento === "N/A"
        //   ? null
        //   : info.credito_receptor!.numDocumento,
        nit: saleCustomer!.customer.nit,
        nrc: saleCustomer ? saleCustomer.customer.nrc : info.credito_receptor!.nrc,
        nombre: saleCustomer ? saleCustomer.customer.nombre : info.credito_receptor!.nombre,
        codActividad: saleCustomer!.customer.codActividad,
        descActividad: saleCustomer!.customer.descActividad,
        direccion: {
          departamento: saleCustomer?.customer.direccion.departamento
            ? saleCustomer.customer.direccion.departamento
            : info.credito_address.departamento,
          municipio: saleCustomer?.customer.direccion.municipio
            ? saleCustomer.customer.direccion.municipio
            : info.credito_address!.municipio,
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
          //-------------------
          tipoItem: saleCustomer?.tipoItem ? saleCustomer?.tipoItem : 1,
          uniMedida: saleCustomer?.uniMedida ? saleCustomer?.uniMedida : Number(26),
          // en proceso
          //-------------------
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
          tributos: ['20'],
          psv: 0,
          noGravado: 0,
        };
      }),
      resumen: {
        totalNoSuj: 0,
        totalExenta: 0,
        totalGravada: Number(Number(info.credito_resumen.totalGravada).toFixed(2)),
        subTotalVentas: Number(Number(info.credito_resumen.subTotalVentas).toFixed(2)),
        descuNoSuj: 0,
        descuExenta: 0,
        descuGravada: 0,
        porcentajeDescuento: Number(Number(info.credito_resumen.porcentajeDescuento).toFixed(2)),
        totalDescu: Number(Number(info.credito_resumen.totalDescu).toFixed(2)),
        tributos: [
          {
            codigo: info.credito_resumen.tributos[0].codigo,
            descripcion: info.credito_resumen.tributos[0].descripcion,
            valor: info.credito_resumen.tributos[0].valor,
          },
        ],
        subTotal: Number(Number(info.credito_resumen.subTotal).toFixed(2)),
        ivaRete1: 0,
        reteRenta: 0,
        // totalIva: info.credito_resumen.totalIva,
        montoTotalOperacion: Number(Number(info.credito_resumen.montoTotalOperacion).toFixed(2)),
        totalNoGravado: 0,
        totalPagar: Number(Number(info.credito_resumen.totalPagar).toFixed(2)),
        totalLetras: info.credito_resumen.totalLetras,
        saldoFavor: 0,
        condicionOperacion: 1,
        ivaPerci1: 0,
        pagos: [
          {
            codigo: info.credito_pagos.codigo,
            montoPago: info.credito_pagos.montoPago,
            referencia: '',
            plazo: null,
            periodo: null,
          },
        ],
        numPagoElectronico: null,
      },
      extension: null,
      apendice: null,
    },
  }
};
