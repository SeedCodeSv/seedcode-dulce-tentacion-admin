import { Supplier } from '@/types/supplier.types';
import { IPagination } from '@/types/global.types';

export const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');

  return `${day}/${month}/${year}`;
};

export const formatControlNumber = (controlNumber: string) => {
  if (controlNumber !== '' && controlNumber !== 'N/A' && controlNumber.length > 0) {
    return controlNumber.replace(/-/g, '');
  }

  return '';
};

export const formatDteType = (typeDte: string) => {
  switch (typeDte) {
    case '03':
      return '03. COMPROBANTE DE CRÉDITO FISCAL';
    case '05':
      return '05. NOTA DE CRÉDITO';
    case '06':
      return '06. NOTA DE DÉBITO';
    default:
      return '';
  }
};

export const formatNit = (supplier: Supplier) => {
  if (
    supplier.nit &&
    supplier.nit.length > 0 &&
    supplier.nit !== '' &&
    supplier.nit !== '0' &&
    supplier.nit !== 'N/A'
  ) {
    return supplier.nit;
  }

  if (
    supplier.nrc &&
    supplier.nrc.length > 0 &&
    supplier.nrc !== '' &&
    supplier.nrc !== '0' &&
    supplier.nrc !== 'N/A'
  ) {
    return supplier.nrc;
  }

  return '';
};

export function formatMoney(amount: number): string {
  return Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const formatPercentage = (per: number) => {
  return `${per.toFixed(2)}%`;
}

export const TypeInventoryMoment = [
  {
    id: 3,
    name: 'Recepcion',
    type: 'Entradas',
  },
  {
    id: 4,
    name: 'Perdida',
    type: 'Salidas',
  },
  {
    id: 5,
    name: 'Dañado',
    type: 'Salidas',
  },
  {
    id: 6,
    name: 'Devolucion o Anulacion',
    type: 'Entradas',
  },
];

export const typesInventoryMovement = [
  {
    id: 1,
    type: 'Salidas',
  },
  {
    id: 2,
    type: 'Entradas',
  },
];

export const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b] as [number, number, number];
};

export const hexToARGB = (hex: string) => {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  return `FF${hex.toUpperCase()}`;
};


export const TypesVentas = [
  { label: "TODOS", value: '' },
  { label: 'NOTAS DE REMISION', value: '04' },
  { label: "FACTURA COMERCIAL", value: '01' },
  { label: 'FACTURA CREDITO FISCAL', value: '03' },
  { label: 'SUJETO EXCLUIDO', value: '14' },
  { label: 'NOTA DE CREDITO', value: '05' },
  { label: 'NOTA DE DEBITO', value: '06' }

]

export const estadosV = [
  { label: 'TODOS', value: '' },
  { label: 'PROCESADO', value: 'PROCESADO' },
  { label: 'PENDIENTE', value: 'PENDIENTE' },
  { label: 'CONTINGENCIA', value: 'CONTINGENCIA' },
  { label: 'INVALIDADO', value: 'INVALIDADO' }
]

export const convertImageToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');

      resolve(dataURL);
    };
    img.onerror = (error) => {
      reject(error);
    };
  });
};

export const initialPagination: IPagination = {
  total: 0,
  totalPag: 0,
  currentPag: 0,
  nextPag: 0,
  prevPag: 0,
  status: 0,
  ok: false,
};

export const generateUniqueId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

