import ExcelJS from 'exceljs';

import { ShoppingReport } from '@/types/shopping.types';
import { Supplier } from '@/types/supplier.types';

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');

  return `${day}/${month}/${year}`;
};

export const generate_anexe_shopping = async (shoppings: ShoppingReport[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ANEXO DE COMPRAS');

  worksheet.columns = [
    { key: 'A', width: 23.57 },
    { key: 'B', width: 37.29 },
    { key: 'C', width: 22.57 },
    { key: 'D', width: 18.57 },
    { key: 'E', width: 28 },
    { key: 'F', width: 36.29 },
    { key: 'G', width: 20 },
    { key: 'H', width: 24.71 },
    { key: 'I', width: 24.71 },
    { key: 'J', width: 24.71 },
    { key: 'K', width: 24.71 },
    { key: 'L', width: 24.71 },
    { key: 'M', width: 24.71 },
    { key: 'N', width: 24.71 },
    { key: 'O', width: 24.71 },
    { key: 'P', width: 24.71 },
    { key: 'Q', width: 24.71 },
    { key: 'R', width: 24.71 },
    { key: 'S', width: 24.71 },
    { key: 'T', width: 24.71 },
    { key: 'U', width: 24.71 },
  ];

  const titles = [
    {
      title: 'FECHA DE EMISIÓN DEL DOCUMENTO',
      column: 'A',
    },
    {
      title: 'CLASE DE DOCUMENTO',
      column: 'B',
    },
    {
      title: 'TIPO DE DOCUMENTO',
      column: 'C',
    },
    {
      title: 'NUMERO DE DOCUMENTO',
      column: 'D',
    },
    {
      title: 'NIT  O NRC DEL PROVEEDOR',
      column: 'E',
    },
    {
      title: 'NOMBRE DEL PROVEEDOR',
      column: 'F',
    },
    {
      title: 'COMPRAS INTERNAS EXENTAS',
      column: 'G',
    },
    {
      title: 'INTERNACIONES EXENTAS Y/O NO SUJETAS',
      column: 'H',
    },
    {
      title: 'IMPORTACIONES EXENTAS Y/O NO SUJETAS',
      column: 'I',
    },
    {
      title: 'COMPRAS INTERNAS GRAVADAS',
      column: 'J',
    },
    {
      title: 'INTERNACIONES GRAVADAS DE BIENES',
      column: 'K',
    },
    {
      title: 'IMPORTACIONES GRAVADAS DE BIENES',
      column: 'L',
    },
    {
      title: 'IMPORTACIONES GRAVADAS DE SERVICIOS',
      column: 'M',
    },
    {
      title: 'CRÉDITO FISCAL',
      column: 'N',
    },
    {
      title: 'TOTAL DE COMPRAS',
      column: 'O',
    },
    {
      title: 'DUI DEL PROVEEDOR ',
      column: 'P',
    },
    {
      title: 'TIPO DE OPERACIÓN (Renta)',
      column: 'Q',
    },
    {
      title: 'CLASIFICACIÓN (Renta)',
      column: 'R',
    },
    {
      title: 'SECTOR (Renta)',
      column: 'S',
    },
    {
      title: 'TIPO DE COSTO/GASTO (Renta)',
      column: 'T',
    },
    {
      title: 'NUMERO DEL ANEXO',
      column: 'U',
    },
  ];

  worksheet.getRow(1).height = 32.25;

  titles.forEach((title) => {
    worksheet.getCell(`${title.column}1`).style = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5b9bd5' } },
    };
    worksheet.getCell(`${title.column}1`).value = title.title;
    worksheet.getCell(`${title.column}1`).font = {
      bold: true,
      size: 11,
      color: { argb: 'FFFFFFFF' },
    };
    worksheet.getCell(`${title.column}1`).alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
  });

  let nextLine = 2;

  for (const shopping of shoppings) {
    const ivaExenta = shopping.tributes
      .filter((a) => a.codigo !== '20')
      .map((b) => Number(b.value))
      .reduce((a, b) => a + b, 0);

    worksheet.getCell(`A${nextLine}`).value = formatDate(shopping.fecEmi);
    worksheet.getCell(`B${nextLine}`).value = formatTypes(shopping).classDocument;
    worksheet.getCell(`C${nextLine}`).value = formatDteType(shopping.typeDte);
    worksheet.getCell(`D${nextLine}`).value = formatControlNumber(
      !shopping.controlNumber.includes('DTE') ? shopping.controlNumber : shopping.generationCode
    );
    worksheet.getCell(`E${nextLine}`).value = formatNit(shopping.supplier);
    worksheet.getCell(`F${nextLine}`).value = shopping.supplier.nombre;
    worksheet.getCell(`G${nextLine}`).value =
      shopping.typeSale === 'Interna'
        ? Number(shopping.totalExenta) + Number(shopping.totalNoSuj) + ivaExenta
        : 0;
    worksheet.getCell(`H${nextLine}`).value =
      shopping.typeSale === 'Internacion'
        ? Number(shopping.totalExenta) + Number(shopping.totalNoSuj) + ivaExenta
        : 0;
    worksheet.getCell(`I${nextLine}`).value =
      shopping.typeSale === 'Importacion'
        ? Number(shopping.totalExenta) + Number(shopping.totalNoSuj) + ivaExenta
        : 0;
    worksheet.getCell(`J${nextLine}`).value =
      shopping.typeSale === 'Interna' ? Number(shopping.totalGravada) : 0;
    worksheet.getCell(`K${nextLine}`).value =
      shopping.typeSale === 'Internacion' ? Number(shopping.totalGravada) : 0;
    worksheet.getCell(`L${nextLine}`).value =
      shopping.typeSale === 'Importacion' ? Number(shopping.totalGravada) : 0;
    worksheet.getCell(`M${nextLine}`).value = 0.0;
    worksheet.getCell(`N${nextLine}`).value = Number(shopping.totalGravada) * 0.13;
    worksheet.getCell(`O${nextLine}`).value = {
      formula: `=SUM(G${nextLine}:N${nextLine})`,
      result: 0,
    };
    worksheet.getCell(`P${nextLine}`).value = formatNumDocument(shopping.supplier);
    worksheet.getCell(`Q${nextLine}`).value = formatTypes(shopping).typeOperation;
    worksheet.getCell(`R${nextLine}`).value = formatTypes(shopping).classification;
    worksheet.getCell(`S${nextLine}`).value = formatTypes(shopping).sector;
    worksheet.getCell(`T${nextLine}`).value = formatTypes(shopping).typeCostSpent;
    worksheet.getCell(`U${nextLine}`).value = 3;

    //formats
    worksheet.getCell(`G${nextLine}`).numFmt = '#,##0.00';
    worksheet.getCell(`H${nextLine}`).numFmt = '#,##0.00';
    worksheet.getCell(`I${nextLine}`).numFmt = '#,##0.00';
    worksheet.getCell(`J${nextLine}`).numFmt = '#,##0.00';
    worksheet.getCell(`K${nextLine}`).numFmt = '#,##0.00';
    worksheet.getCell(`L${nextLine}`).numFmt = '#,##0.00';
    worksheet.getCell(`M${nextLine}`).numFmt = '#,##0.00';
    worksheet.getCell(`N${nextLine}`).numFmt = '#,##0.00';
    worksheet.getCell(`O${nextLine}`).numFmt = '#,##0.00';

    nextLine += 1;
  }

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], { type: 'application/octet-stream' });

  return blob;
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

const formatNumDocument = (supplier: Supplier) => {
  if (formatNit(supplier) === '') {
    return supplier.numDocumento &&
      supplier.numDocumento.length > 0 &&
      supplier.numDocumento !== '' &&
      supplier.numDocumento !== '0' &&
      supplier.numDocumento !== 'N/A'
      ? supplier.numDocumento
      : '';
  }

  return '';
};

export const formatTypes = (shopping: ShoppingReport, onlyCodes: boolean = false) => {
  if (onlyCodes) {
    return {
      typeOperation: shopping.operationTypeCode,
      classification: shopping.classificationCode,
      sector: shopping.sectorCode,
      typeCostSpent: shopping.typeCostSpentCode,
      classDocument: shopping.classDocumentCode,
    };
  }

  return {
    typeOperation: `${shopping.operationTypeCode} ${shopping.operationTypeValue} `,
    classification: `${shopping.classificationCode} ${shopping.classificationValue} `,
    sector: `${shopping.sectorCode} ${shopping.sectorValue} `,
    typeCostSpent: `${shopping.typeCostSpentCode} ${shopping.typeCostSpentValue} `,
    classDocument: `${shopping.classDocumentCode} ${shopping.classDocumentValue} `,
  };
};

export function formatMoney(amount: number): string {
  return Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const formatPercentage= (per:number) => {
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

    return [r, g, b];
  };

  export const TypesVentas=[
  {label:"TODOS", value:''},
  {label:'Notas de Remisión', value:'04'},
  {label:"Factura Comercial", value:'01'},
  {label:'Factura Credito Fiscal', value:'03'},
  {label:'Sujeto Excluido', value:'14'},
  {label:'Nota de Credito', value:'05'},
  {label:'Nota de Debito', value:'06'}
  
]

export const estadosV = [
  { label: 'PROCESADO', value: 'PROCESADO' },
  { label: 'CONTINGENCIA', value: 'CONTINGENCIA' },
  { label: 'INVALIDADO', value: 'INVALIDADO' }
]