// import { CreditSaleContingenciaI } from "../../plugins/dexie/store/types/contingencia_credito_store.types";
// import { DteJson as IFactura } from "../../types/DTE/DTE.types";
// import { Sale } from "../../types/report_contigence";
// import { ITransmitter } from "../../types/transmitter.types";
// import { ambiente } from "../../utils/constants";
import React from 'react'

function credito_generate() {
 
}

export default credito_generate
// export const generateFactura = (info: CreditSaleContingenciaI, transmitter: ITransmitter, sale: Sale): IFactura => {
//     return {
//         nit: transmitter.nit,
//         activo: true,
//         passwordPri: transmitter.clavePublica,
//         dteJson: {
//             identificacion: {
//                 version: 1,
//                 codigoGeneracion: sale.codigoGeneracion,
//                 ambiente: ambiente,
//                 tipoDte: "01",
//                 numeroControl: sale.numeroControl,
//                 tipoModelo: 1,
//                 tipoOperacion: 1,
//                 tipoContingencia: null,
//                 motivoContin: null,
//                 tipoMoneda: "USD",
//                 fecEmi: sale.fecEmi.toString(),
//                 horEmi: sale.horEmi.toString(),
//             },
//             documentoRelacionado: null,
//             emisor: {
//                 nit: transmitter.nit,
//                 nrc: transmitter.nrc,
//                 nombre: transmitter.nombre,
//                 nombreComercial: transmitter.nombreComercial,
//                 codActividad: transmitter.codActividad,
//                 descActividad: transmitter.descActividad,
//                 tipoEstablecimiento: transmitter.tipoEstablecimiento,
//                 direccion: {
//                     departamento: transmitter.direccion.departamento,
//                     municipio: transmitter.direccion.municipio,
//                     complemento: transmitter.direccion.complemento,
//                 },
//                 telefono: transmitter.telefono,
//                 correo: transmitter.correo,
//                 codEstable: transmitter.codEstable,
//                 codEstableMH: transmitter.codEstableMH === "0" ? null : transmitter.codEstableMH,
//                 codPuntoVenta: transmitter.codPuntoVenta,
//                 codPuntoVentaMH:
//                     transmitter.codPuntoVentaMH === "0" ? null : transmitter.codPuntoVentaMH,
//             },
//             receptor: {
//                 tipoDocumento:
//                     info.receptor!.tipoDocumento === "0" || info.receptor.tipoDocumento === "N/A"
//                         ? null
//                         : info.receptor!.tipoDocumento,
//                 numDocumento:
//                     info.receptor!.numDocumento === "0" || info.receptor.numDocumento === "N/A"
//                         ? null
//                         : info.receptor!.numDocumento,
//                 nrc: Number(info.receptor!.nrc) === 0 ? null : info.receptor!.nrc,
//                 nombre: info.receptor!.nombre,
//                 codActividad:
//                     Number(info.receptor!.codActividad) === 0 ? null : info.receptor!.codActividad,
//                 descActividad:
//                     Number(info.receptor!.descActividad) === 0 ? null : info.receptor!.descActividad,
//                 direccion: {
//                     departamento: "03",
//                     municipio: info.direccion_receptor.municipio,
//                     complemento: info.direccion_receptor.complemento,
//                 },
//                 telefono: info.receptor!.telefono,
//                 correo: info.receptor!.correo,
//             },
//             otrosDocumentos: null,
//             ventaTercero: null,
//             cuerpoDocumento: info.cuerpo_documento.map((cuerpo) => {
//                 return {
//                     numItem: cuerpo.numItem,
//                     tipoItem: 1,
//                     uniMedida: Number(26),
//                     numeroDocumento: null,
//                     cantidad: cuerpo.cantidad,
//                     codigo: null,
//                     codTributo: null,
//                     descripcion: cuerpo.descripcion,
//                     precioUni: cuerpo.precioUni,
//                     montoDescu: cuerpo.montoDescu,
//                     ventaNoSuj: 0,
//                     ventaExenta: 0,
//                     ventaGravada: cuerpo.ventaGravada,
//                     ivaItem: cuerpo.ivaItem,
//                     tributos: null,
//                     psv: 0,
//                     noGravado: 0,
//                 }
//             }),
//             resumen: {
//                 totalNoSuj: 0,
//                 totalExenta: 0,
//                 totalGravada: info.resumen.totalGravada,
//                 subTotalVentas: info.resumen.subTotalVentas,
//                 descuNoSuj: 0,
//                 descuExenta: 0,
//                 descuGravada: 0,
//                 porcentajeDescuento: info.resumen.porcentajeDescuento,
//                 totalDescu: info.resumen.totalDescu,
//                 tributos: null,
//                 subTotal: info.resumen.subTotal,
//                 ivaRete1: 0,
//                 reteRenta: 0,
//                 totalIva: info.resumen.totalIva,
//                 montoTotalOperacion: info.resumen.montoTotalOperacion,
//                 totalNoGravado: 0,
//                 totalPagar: info.resumen.totalPagar,
//                 totalLetras: info.resumen.totalLetras,
//                 saldoFavor: 0,
//                 condicionOperacion: 1,
//                 pagos: [
//                     {
//                         codigo: info.pagos.codigo,
//                         montoPago: info.pagos.montoPago,
//                         referencia: "",
//                         plazo: null,
//                         periodo: null,
//                     }
//                 ],
//                 numPagoElectronico: null,
//             },
//             extension: null,
//             apendice: null,
//         }
//     }
// }

// // export const generateCreditoFiscl = (): DteJson => {

// // }