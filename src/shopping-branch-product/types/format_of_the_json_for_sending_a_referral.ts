import { Branches, BranchProduct } from './shipping_branch_product.types';
import { CuerpoDocumento, Direccion, DocumentoNoteOfRemission } from './notes_of_remision.types';

import { generate_uuid } from '@/utils/random/random';
import { Correlativo } from '@/types/correlatives_dte.types';
import { getElSalvadorDateTime } from '@/utils/dates';
import { ITransmitter } from '@/types/transmitter.types';
import { Customer } from '@/types/customers.types';
import { Employee } from '@/types/employees.types';
import { ambiente } from '@/utils/constants';
import { generate_control } from '@/utils/dte';
import { formatearNumero } from '@/utils/make-dte';

const total = (productsCarts: BranchProduct[]) => {
  const total = productsCarts
    .map((cp) => Number(cp.quantity) * Number(cp.costoUnitario))
    .reduce((a, b) => a + b, 0);

  return total;
};

export function calcularDescuento(precioOriginal: number, precioDeseado: number) {
  const montoDescuento = precioOriginal - precioDeseado;
  const porcentajeDescuento = (montoDescuento / precioOriginal) * 100;

  return { montoDescuento, porcentajeDescuento };
}
const calDiscount = (productsCarts: BranchProduct[]) => {
  return productsCarts.map(() => 0).reduce((a, b) => a + b, 0);
};

function formatName(payload: Employee) {
  const fullName =
    payload?.firstName +
    ' ' +
    payload?.secondName +
    ' ' +
    payload?.firstLastName +
    ' ' +
    payload?.secondLastName;

  return fullName;
}
export const generateJsonNoteRemision = (
  employee: Employee,
  transmitter: ITransmitter,
  correlative: Correlativo,
  product_selected: BranchProduct[],
  branch: Branches,
  observation = '',

  ivaRete1 = 0,
  employeeReceptor?: Employee
): DocumentoNoteOfRemission => {
  return {
    nit: transmitter.nit,
    passwordPri: transmitter.clavePrivada,
    dteJson: {
      identificacion: {
        version: 3,
        ambiente: ambiente,
        tipoDte: '04',
        numeroControl: generate_control(
          '04',
          correlative.codEstable!,
          correlative.codPuntoVenta!,
          formatearNumero(correlative.next)
        ),
        codigoGeneracion: generate_uuid().toUpperCase(),
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContin: null,
        tipoMoneda: 'USD',
        ...getElSalvadorDateTime(),
      },
      documentoRelacionado: null,
      emisor: generate_emisor(transmitter, correlative, branch),
      receptor: generateEmployeeReceptor(transmitter),
      ventaTercero: null,
      cuerpoDocumento: make_cuerpo_documento(product_selected),
      resumen: {
        totalNoSuj: 0,
        totalExenta: 0,
        totalGravada: Number(total(product_selected).toFixed(2)),
        subTotalVentas: Number(total(product_selected).toFixed(2)),
        descuNoSuj: 0,
        descuExenta: 0,
        descuGravada: 0,
        porcentajeDescuento: 0,
        totalDescu: Number(calDiscount(product_selected).toFixed(2)),
        tributos: null,
        subTotal: Number(total(product_selected).toFixed(2)),
        montoTotalOperacion: Number(total(product_selected).toFixed(2)),
        totalLetras: convertCurrencyFormat((total(product_selected) - ivaRete1).toFixed(2)),
      },
      extension: {
        nombEntrega: formatName(employee ?? ({} as Employee)),
        docuEntrega: employee?.dui ?? employee?.nit,
        nombRecibe: formatName(employeeReceptor ?? ({} as Employee)),
        docuRecibe: employeeReceptor?.dui ?? employee?.nit,
        observaciones: observation,
      },
      apendice: null,
    },
  };
};

export const generateEmployeeReceptor = (transmitter: ITransmitter) => {
  return {
    bienTitulo: '04',
    nombreComercial: null,
    tipoDocumento: '36',
    numDocumento: transmitter.nit,
    nrc: transmitter.nrc,
    nombre: transmitter?.nombre,
    codActividad: transmitter.codActividad,
    descActividad: transmitter.descActividad,
    direccion: transmitter
      ? {
          departamento: transmitter.direccion.departamento,
          municipio: transmitter.direccion.municipio,
          complemento: transmitter.direccion.complemento,
        }
      : null,
    telefono: transmitter.telefono,
    correo: transmitter.correo,
  };
};



export const generateUrlJson = (
  name: string,
  generation: string,
  format: 'json' | 'pdf',
  typeDte: string,
  fecEmi: string
) => {
  return `NOTAS-REMISION/${
    name
  }/${new Date().getFullYear()}/NOTAS-REMISION/${typeDte}/${fecEmi}/${generation}/${generation}.${format}`;
};
export const generate_emisor = (
  transmitter: ITransmitter,
  correlative: Correlativo,
  branch: Branches
) => {
  return {
    nit: transmitter.nit,
    nrc: transmitter.nrc,
    nombre: transmitter.nombre,
    nombreComercial: transmitter.nombreComercial,
    codActividad: transmitter.codActividad,
    descActividad: transmitter.descActividad,
    tipoEstablecimiento: correlative.tipoEstablecimiento,
    direccion: transmitter
      ? ({
          departamento: transmitter.direccion.departamento,
          municipio: transmitter.direccion.municipio,
          complemento: transmitter.direccion.complemento,
        } as Direccion)
      : branch.address,
    telefono: transmitter.telefono,
    correo: transmitter.correo,
    codEstable: correlative.codEstable,
    codEstableMH: correlative.codEstableMH === '0' ? '' : correlative.codEstableMH,
    codPuntoVenta: correlative.codPuntoVenta,
    codPuntoVentaMH: correlative.codPuntoVentaMH === '0' ? '' : correlative.codPuntoVentaMH,
  };
};

export function TypeDocument(value: string) {
  if (value.length === 9) {
    return '13';
  } else {
    if (value.length === 14) {
      return '36';
    }
  }

  return '';
}

export function agregarGuion(texto: string) {
  const textoSinGuion = texto.replace(/-/g, '');

  if (textoSinGuion.length === 9 && !texto.includes('-')) {
    return textoSinGuion.slice(0, -1) + '-' + textoSinGuion.slice(-1);
  }

  return texto;
}

export const generate_receptor = (value: Customer) => {
  return {
    tipoDocumento:
      Number(value!.nrc) !== 0 && value!.nrc
        ? '36'
        : value!.tipoDocumento === '0' || value.tipoDocumento === 'N/A'
          ? ''
          : value!.tipoDocumento,
    numDocumento:
      Number(value!.nrc) !== 0 && value!.nrc
        ? value!.nit
        : value!.numDocumento === '0' || value.numDocumento === 'N/A'
          ? ''
          : agregarGuion(value!.numDocumento),
    nrc: Number(value!.nrc) === 0 ? '' : value!.nrc,
    nombre: value!.nombre,
    codActividad: Number(value!.codActividad) === 0 ? '' : value!.codActividad,
    descActividad: Number(value!.descActividad) === 0 ? '' : value!.descActividad,
    direccion: {
      departamento: value!.direccion?.departamento,
      municipio: value!.direccion?.municipio,
      complemento: value!.direccion?.complemento,
    },
    telefono: value!.telefono,
    correo: value!.correo,
  };
};
export const make_cuerpo_documento = (products_cart: BranchProduct[]): CuerpoDocumento[] => {
  return products_cart.map((cp, index) => {
    const prices = [Number(cp.price), Number(cp.priceA), Number(cp.priceB), Number(cp.priceC)];

    const costeUnit = prices.includes(Number(cp.costoUnitario))
      ? Number(cp.costoUnitario)
      : Number(cp.costoUnitario) === Number(prices[0])
        ? Number(prices[1])
        : Number(cp.costoUnitario);

    const cantidad = cp.quantity ?? 0;

    return {
      numItem: index + 1,
      tipoItem: Number(cp.product.tipoItem),
      uniMedida: Number(26),
      numeroDocumento: null,
      cantidad,
      codigo: cp.product.code,
      codTributo: null,
      descripcion: cp.product.name,
      precioUni: Number(costeUnit.toFixed(2)),
      montoDescu: 0,
      ventaNoSuj: 0,
      ventaExenta: 0,
      ventaGravada: Number((cantidad * Number(cp.costoUnitario)).toFixed(2)),
      tributos: null,
   
    };
  });
};

export const get_iva = (price: number, quantity: number) => {
  const total = Number(price) * Number(quantity);

  const iva = total / 1.13;

  return total - iva;
};

export function convertCurrencyFormat(input: string) {
  const [amount, cents = '00'] = input.includes('.') ? input.split('.') : [input];

  const numberToWords = (num: number): string => {
    const units = [
      '',
      'UNO',
      'DOS',
      'TRES',
      'CUATRO',
      'CINCO',
      'SEIS',
      'SIETE',
      'OCHO',
      'NUEVE',
      'DIEZ',
      'ONCE',
      'DOCE',
      'TRECE',
      'CATORCE',
      'QUINCE',
      'DIECISEIS',
      'DIECISIETE',
      'DIECIOCHO',
      'DIECINUEVE',
    ];
    const tens = [
      '',
      '',
      'VEINTE',
      'TREINTA',
      'CUARENTA',
      'CINCUENTA',
      'SESENTA',
      'SETENTA',
      'OCHENTA',
      'NOVENTA',
    ];
    const hundreds = [
      '',
      'CIEN',
      'DOSCIENTOS',
      'TRESCIENTOS',
      'CUATROCIENTOS',
      'QUINIENTOS',
      'SEISCIENTOS',
      'SETECIENTOS',
      'OCHOCIENTOS',
      'NOVECIENTOS',
    ];

    if (num < 20) return units[num];
    if (num < 100) {
      const unit = num % 10;
      const ten = Math.floor(num / 10);

      return unit === 0 ? tens[ten] : `${tens[ten]} Y ${units[unit]}`;
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      const remainderInWords = remainder > 0 ? ` ${numberToWords(remainder)}` : '';

      return hundreds[hundred] + remainderInWords;
    }
    if (num < 1000000) {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;
      const thousandsInWords = thousands > 1 ? numberToWords(thousands) + ' MIL' : 'MIL';
      const remainderInWords = remainder > 0 ? ` ${numberToWords(remainder)}` : '';

      return thousandsInWords + remainderInWords;
    }

    return '';
  };

  const amountInWords = numberToWords(parseInt(amount));
  const centsFormatted = cents.padEnd(2, '0');

  return `${amountInWords} ${centsFormatted}/100 DOLARES AMERICANOS`;
}
