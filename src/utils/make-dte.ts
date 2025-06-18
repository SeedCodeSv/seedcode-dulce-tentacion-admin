import { DteJson } from '../types/DTE/credito_fiscal.types';
import { ITransmitter } from '../types/transmitter.types';
import { Customer } from '../types/customers.types';
import { ISendMHFiscal } from '../types/DTE/credito_fiscal.types';

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

export const get_iva = (price: number, quantity: number) => {
  const total = Number(price) * Number(quantity);

  const iva = total / 1.13;

  return total - iva;
};

export function formatearNumero(numero: number): string {
  const numeroFormateado: string = numero.toString().padStart(15, '0');

  return numeroFormateado;
}

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
