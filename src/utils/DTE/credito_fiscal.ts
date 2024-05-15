import { FiscalReceptor } from "../../types/DTE/credito_fiscal.types";
import { ResponseMHSuccess } from "../../types/DTE/contingencia.types";
import { ISendMHFiscal } from "../../types/DTE/credito_fiscal.types";
import { IFormasDePago } from "../../types/DTE/forma_de_pago.types";
import { ITipoDocumento } from "../../types/DTE/tipo_documento.types";
import { TipoTributo } from "../../types/DTE/tipo_tributo.types";
import { ITransmitter } from "../../types/transmitter.types";
import { getElSalvadorDateTime } from "../dates";
import { generate_control } from "../dte";
import { formatearNumero, generate_emisor } from "../make-dte";
import { convertCurrencyFormat } from "../money";
import { ambiente } from "../constants";
import { generate_uuid } from "../random/random";
import { ICartProduct } from "../../types/branch_products.types";

export const make_to_pdf_fiscal = (
  DTE: ISendMHFiscal,
  total: number,
  data: ResponseMHSuccess
) => {
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
      porcentajeDescuento: Number(
        DTE.dteJson.resumen.porcentajeDescuento
      ).toFixed(2),
      totalDescu: Number(DTE.dteJson.resumen.totalDescu).toFixed(2),
      tributos: DTE.dteJson.resumen.tributos,
      subTotal: Number(DTE.dteJson.resumen.subTotal).toFixed(2),
      ivaRete1: Number(DTE.dteJson.resumen.ivaRete1).toFixed(2),
      reteRenta: Number(DTE.dteJson.resumen.reteRenta).toFixed(2),
      montoTotalOperacion: Number(
        DTE.dteJson.resumen.montoTotalOperacion
      ).toFixed(2),
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
    cuerpoDocumento: make_cuerpo_documento_pdf_fiscal(DTE),
  };
};

export const make_cuerpo_documento_pdf_fiscal = (DTE: ISendMHFiscal) => {
  return DTE.dteJson.cuerpoDocumento.map((item) => {
    return {
      ...item,
      montoDescu: Number(item.montoDescu).toFixed(2),
      ventaNoSuj: Number(item.ventaNoSuj).toFixed(2),
      ventaExenta: Number(item.ventaExenta).toFixed(2),
      ventaGravada: Number(item.ventaGravada).toFixed(2),
      tributos: item.tributos,
      psv: Number(item.psv).toFixed(2),
      noGravado: Number(item.noGravado).toFixed(2),
    };
  });
};

const total = (cart_products: ICartProduct[]) => {
  return cart_products
    .map((cp) => Number(cp.quantity) * Number(cp.price))
    .reduce((a, b) => a + b, 0);
};

// const total_iva = (cart_products: ICartProduct[]) => {
//   return cart_products
//     .map((cp) => {
//       const total = Number(cp.price) * Number(cp.quantity);

//       const iva = total / 1.13;

//       return total - iva;
//     })
//     .reduce((a, b) => a + b, 0);
// };
const total_iva = (cart_products: ICartProduct[]) => {
  return cart_products
    .map((cp) => {
      const total = Number(cp.price) * Number(cp.quantity);

      const iva = total * 0.13;

      return iva;
    })
    .reduce((a, b) => a + b, 0);
};
function calcularPorcentajeDescuento(
  totalSinDescuento: number,
  totalDescuento: number
): number {
  return ((totalSinDescuento - totalDescuento) / totalSinDescuento) * 100;
}
// const calDiscount = (cart_products: ICartProduct[]) => {
//   return cart_products
//     .map((prd) => Number(prd.quantity) * Number(prd.price))
//     .reduce((a, b) => a + b, 0);
// };
const calDiscount = (cart_products: ICartProduct[]) => {
return cart_products.map((pr) => pr.discount).reduce((a, b) => a + b, 0);
}
const total_with_discount = (cart_products: ICartProduct[]) => {
  return cart_products
    .map((prd) => {
      const price =
        Number(prd.price) < prd.base_price ? prd.base_price : Number(prd.price);
      return price * prd.quantity;
    })
    .reduce((a, b) => a + b, 0);
};
export const generate_credito_fiscal = (
  emisor: ITransmitter,
  valueTipo: ITipoDocumento,
  next_number: number,
  receptor: FiscalReceptor,
  products_carts: ICartProduct[],
  tributo?: TipoTributo,
  tipo_pago?: IFormasDePago
) => {
  return {
    nit: emisor.nit,
    activo: true,
    passwordPri: emisor.clavePublica,
    dteJson: {
      identificacion: {
        version: valueTipo.codigo === "03" ? 3 : 1,
        codigoGeneracion: generate_uuid().toUpperCase(),
        ambiente: ambiente,
        tipoDte: valueTipo!.codigo,
        numeroControl: generate_control(
          valueTipo!.codigo,
          emisor.codEstable!,
          emisor.codPuntoVenta!,
          formatearNumero(next_number)
        ),
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContin: null,
        tipoMoneda: "USD",
        ...getElSalvadorDateTime(),
      },
      documentoRelacionado: null,
      emisor: { ...generate_emisor(emisor) },
      receptor,
      otrosDocumentos: null,
      ventaTercero: null,
      cuerpoDocumento: make_cuerpo_documento_fiscal(products_carts),
      resumen: {
        totalNoSuj: 0,
        totalExenta: 0,
        totalGravada: Number(total(products_carts).toFixed(2)),
        subTotalVentas: Number(total(products_carts).toFixed(2)),
        descuNoSuj: 0,
        descuExenta: 0,
        descuGravada: 0,
        porcentajeDescuento: Number(
          calcularPorcentajeDescuento(
            total_with_discount(products_carts),
            calDiscount(products_carts)
          ).toFixed(2)
        ),
        totalDescu: Number(calDiscount(products_carts).toFixed(2)),
        tributos: [
          {
            codigo: tributo!.codigo,
            descripcion: tributo!.valores,
            valor: Number(total_iva(products_carts).toFixed(2)),
          },
        ],
        subTotal: Number(total(products_carts).toFixed(2)),
        ivaRete1: 0,
        reteRenta: 0,
        ivaPerci1: 0,
        montoTotalOperacion: Number(
          (total(products_carts) + total_iva(products_carts)).toFixed(2)
        ),
        totalNoGravado: 0,
        totalPagar: Number(
          (total(products_carts) + total_iva(products_carts)).toFixed(2)
        ),
        totalLetras: convertCurrencyFormat(
          (total(products_carts) + total_iva(products_carts)).toFixed(2)
        ),
        saldoFavor: 0,
        condicionOperacion: 1,
        pagos: [
          {
            codigo: tipo_pago?.codigo,
            montoPago: Number(
              (total(products_carts) + total_iva(products_carts)).toFixed(2)
            ),
            referencia: "",
            plazo: null,
            periodo: null,
          },
        ],
        numPagoElectronico: null,
      },
      extension: null,
      apendice: null,
    },
  } as unknown as ISendMHFiscal;
};
export const make_cuerpo_documento_fiscal = (products_cart: ICartProduct[]) => {
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
        Number(cp.price) < Number(cp.base_price)
          ? Number(cp.base_price)
          : Number(cp.price),
      montoDescu: Number(cp.discount!.toFixed(2)),
      ventaNoSuj: 0,
      ventaExenta: 0,
      ventaGravada: Number((Number(cp.price!) * cp.quantity).toFixed(2)),
      tributos: ["20"],
      psv: 0,
      noGravado: 0,
    };
  });
};
