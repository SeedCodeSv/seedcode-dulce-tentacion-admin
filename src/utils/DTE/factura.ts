import { ITipoDocumento } from '../../types/DTE/tipo_documento.types';
import { Customer } from '../../types/customers.types';
import { ITransmitter } from '../../types/transmitter.types';
import { getElSalvadorDateTime } from '../dates';
import { generate_control } from '../dte';
import {
  formatearNumero,
  generate_emisor,
  generate_receptor,
  make_cuerpo_documento,
} from '../make-dte';
import { convertCurrencyFormat } from '../money';
import { generate_uuid } from '../random/random';
import { ambiente } from '../../utils/constants.ts';
import { ICartProduct } from '../../types/branch_products.types.ts';
import moment from 'moment';
import { FC_PagosItems, SVFE_FC_SEND } from '../../types/svf_dte/fc.types.ts';

export const generate_factura = (
  transmitter: ITransmitter,
  next_number: number,
  valueTipo: ITipoDocumento,
  customer: Customer,
  products_carts: ICartProduct[],
  tipo_pago: FC_PagosItems[]
) :SVFE_FC_SEND => {
  return {
    nit: transmitter.nit,
    activo: true,
    passwordPri: transmitter.clavePublica,
    dteJson: {
      identificacion: {
        version: 1,
        codigoGeneracion: generate_uuid().toUpperCase(),
        ambiente: ambiente,
        tipoDte: '01',
        numeroControl: generate_control(
          valueTipo!.codigo,
          transmitter.codEstable!,
          transmitter.codPuntoVenta!,
          formatearNumero(next_number)
        ),
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContin: null,
        tipoMoneda: 'USD',
        ...getElSalvadorDateTime(),
      },
      documentoRelacionado: null,
      emisor: { ...generate_emisor(transmitter) },
      receptor: { ...generate_receptor(customer!) },
      otrosDocumentos: null,
      ventaTercero: null,
      cuerpoDocumento: make_cuerpo_documento(products_carts),
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
            total_without_discount(products_carts),
            total(products_carts)
          ).toFixed(2)
        ),
        totalDescu: Number(calDiscount(products_carts).toFixed(2)),
        tributos: null,
        subTotal: Number(total(products_carts).toFixed(2)),
        ivaRete1: 0,
        reteRenta: 0,
        totalIva: Number(total_iva(products_carts).toFixed(2)),
        montoTotalOperacion: Number(total(products_carts).toFixed(2)),
        totalNoGravado: 0,
        totalPagar: Number(total(products_carts).toFixed(2)),
        totalLetras: convertCurrencyFormat(total(products_carts).toFixed(2)),
        saldoFavor: 0,
        condicionOperacion: 1,
        pagos: tipo_pago,
        numPagoElectronico: null,
      },
      extension: null,
      apendice: null,
    },
  };
};
function calcularPorcentajeDescuento(totalSinDescuento: number, totalDescuento: number): number {
  return ((totalSinDescuento - totalDescuento) / totalSinDescuento) * 100;
}
const total_without_discount = (productsCarts: ICartProduct[]) => {
  const total = productsCarts
    .map((prd) => {
      const price = Number(prd.price) < prd.base_price ? prd.base_price : Number(prd.price);
      return price * prd.quantity;
    })
    .reduce((a, b) => a + b, 0);

  return total;
};
const calDiscount = (productsCarts: ICartProduct[]) => {
  return productsCarts.map((prd) => prd.discount).reduce((a, b) => a + b, 0);
};
const total = (productsCarts: ICartProduct[]) => {
  const total = productsCarts
    .map((cp) => Number(cp.quantity) * Number(cp.price))
    .reduce((a, b) => a + b, 0);

  return total;
};

const total_iva = (productsCarts: ICartProduct[]) => {
  return productsCarts
    .map((cp) => {
      const total = Number(cp.price) * Number(cp.quantity);

      const iva = total / 1.13;

      return total - iva;
    })
    .reduce((a, b) => a + b, 0);
};

export function verifyApplyAnulation(tipoDte: string, date: string) {
  return new Promise((resolve, reject) => {
    const fechaDTEParseada = moment(date, 'YYYY-MM-DD');

    if (!fechaDTEParseada.isValid()) {
      reject(new Error('Formato de fecha DTE inválido'));
      return;
    }

    const fechaActual = moment();
    const daysDiference = fechaActual.diff(fechaDTEParseada, 'days');

    if (tipoDte === '01') {
      const daysLimit = 90;

      if (daysDiference > daysLimit) {
        reject(new Error('DTE fuera del plazo de disponibilidad (3 meses)'));
        return;
      }
    } else if (tipoDte === '03') {
      const daysLimit = 1;

      if (daysDiference > daysLimit) {
        reject(new Error('DTE fuera del plazo de disponibilidad (1 día)'));
        return;
      }
    } else {
      reject(new Error('Tipo de DTE inválido'));
      return;
    }

    resolve(true);
  });
}
