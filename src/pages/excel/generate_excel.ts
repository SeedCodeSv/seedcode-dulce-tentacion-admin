import ExcelJS from 'exceljs';

import { ITransmitter } from '@/types/transmitter.types';

export const generate_shopping_excel = async (
  shopping_data: Array<Array<string | number>>,
  month: string,
  transmitter: ITransmitter
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Compras');

  worksheet.views = [{ state: 'frozen', xSplit: 5, ySplit: 7 }];

  const merges = [
    'A6:A7',
    'B6:B7',
    'C6:C7',
    'D6:D7',
    'E6:E7',
    'F6:F7',
    'G6:I6',
    'J6:K6',
    'L6:L7',
    'M6:M7',
    'N6:N7',
    'D3:N3',
    'A3:C3',
    'D4:N4',
    'D5:F5',
  ];

  merges.forEach((range) => worksheet.mergeCells(range));

  worksheet.getCell('A6').value = 'No. Corr.';
  worksheet.getCell('B6').value = 'Fecha';
  worksheet.getCell('C6').value = 'No. Doc.';
  worksheet.getCell('D6').value = 'No. Reg.';
  worksheet.getCell('E6').value = 'NIT U DUI';
  worksheet.getCell('F6').value = 'Nombre del proveedor';
  worksheet.getCell('G6').value = 'Compras Gravadas';
  worksheet.getCell('J6').value = 'Compras Exentas';
  worksheet.getCell('L6').value = 'Total compras';
  worksheet.getCell('M6').value = 'Anticipo a cuenta IVA percibido';
  worksheet.getCell('N6').value = 'Compras a Suj. Exluidos';

  worksheet.getCell('G7').value = 'Internas';
  worksheet.getCell('H7').value = 'Import.';
  worksheet.getCell('I7').value = 'IVA';

  worksheet.getCell('J7').value = 'Internas';
  worksheet.getCell('K7').value = 'Import.';

  const titles = [
    { cell: 'A3', text: `REGISTRO No.  ${transmitter.nrc}` },
    { cell: 'D3', text: `ESTABLECIMIENTO:  ${transmitter.nombre}` },
    { cell: 'D4', text: 'LIBRO DE COMPRAS' },
    { cell: 'A5', text: 'MES' },
    { cell: 'B5', text: `${month}` },
    { cell: 'D5', text: `AÑO: ${new Date().getFullYear()}` },
  ];

  titles.forEach(({ cell, text }) => {
    worksheet.getCell(cell).value = text;
    worksheet.getCell(cell).alignment = { horizontal: 'center' };

    if (['A5', 'B5', 'D5'].includes(cell)) {
      worksheet.getCell(cell).font = {
        bold: true,
      };
    }
  });

  worksheet.columns = [
    { key: 'A', width: 5 },
    { key: 'B', width: 10 },
    { key: 'C', width: 25 },
    { key: 'D', width: 10 },
    { key: 'E', width: 15 },
    { key: 'F', width: 45 },
    { key: 'G', width: 10 },
    { key: 'H', width: 10 },
    { key: 'J', width: 10 },
    { key: 'K', width: 10 },
    { key: 'L', width: 15 },
    { key: 'M', width: 10 },
    { key: 'N', width: 10 },
  ];

  const applyAlignmentAndFont = (
    cell: string,
    alignment: Partial<ExcelJS.Alignment>,
    font: Partial<ExcelJS.Font>
  ) => {
    worksheet.getCell(cell).alignment = alignment;
    worksheet.getCell(cell).font = font;
  };

  const fontSize8 = { size: 8, name: 'Calibri' };
  const headersCells = [
    'A6',
    'B6',
    'C6',
    'D6',
    'E6',
    'F6',
    'G6',
    'H6',
    'I6',
    'J6',
    'K6',
    'L6',
    'M6',
    'N6',
    'G7',
    'H7',
    'I7',
    'J7',
    'K7',
  ];

  headersCells.forEach((cell) =>
    applyAlignmentAndFont(cell, { horizontal: 'center', wrapText: true }, fontSize8)
  );

  worksheet.getRow(6).height = 20;

  const borders = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  } as ExcelJS.Borders;

  for (let row = 6; row <= 6 + shopping_data.length + 1; row++) {
    for (let col = 0; col < 14; col++) {
      worksheet.getCell(String.fromCharCode(65 + col) + row).border = borders;
    }
  }

  shopping_data.forEach((item, rowIndex) => {
    const row = rowIndex + 8;

    item.forEach((value, colIndex) => {
      const cell = String.fromCharCode(65 + colIndex) + row;

      if (colIndex === 11) {
        worksheet.getCell(cell).value = {
          formula: `SUM(${String.fromCharCode(65 + colIndex - 5)}${row}:${String.fromCharCode(65 + colIndex - 1)}${row})`,
          result: 0
        }
      } else {
        worksheet.getCell(cell).value = value
      }

      worksheet.getCell(cell).alignment = { horizontal: 'left', wrapText: true };
      worksheet.getCell(cell).font = { name: 'Calibri', size: 8 };
      if (colIndex === 1) worksheet.getCell(cell).numFmt = 'mm/dd/yyyy';
      if ([6, 8, 9, 11, 12, 13].includes(colIndex))
        worksheet.getCell(cell).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
    });
  });

  const nextLine = shopping_data.length + 8;

  worksheet.getCell(`F${nextLine}`).value = 'Total';
  ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'].forEach((col) => {
    worksheet.getCell(`${col}${nextLine}`).value = {
      formula: `SUM(${col}8:${col}${nextLine - 1})`,
      result: 0,
    };
    worksheet.getCell(`${col}${nextLine}`).font = { name: 'Calibri', bold: true, size: 8 };
    worksheet.getCell(`${col}${nextLine}`).numFmt =
      '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
  });

  const borders_cells = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

  borders_cells.forEach((cell) => {
    worksheet.getCell(`${cell}${nextLine}`).border = borders;
  });

  worksheet.mergeCells(`E${nextLine + 5}:F${nextLine + 5}`);
  worksheet.getCell(`E${nextLine + 5}`).value = '';
  worksheet.mergeCells(`G${nextLine + 5}:I${nextLine + 5}`);
  worksheet.getCell(`G${nextLine + 5}`).value = '__________________________';

  worksheet.mergeCells(`E${nextLine + 6}:F${nextLine + 6}`);
  worksheet.getCell(`E${nextLine + 6}`).value = 'Nombre contador o contribuyente';
  worksheet.getCell(`E${nextLine + 6}`).font = { bold: true, name: 'Calibri' };

  worksheet.mergeCells(`G${nextLine + 6}:I${nextLine + 6}`);
  worksheet.getCell(`G${nextLine + 6}`).value = 'Firma contador o contribuyente';
  worksheet.getCell(`G${nextLine + 6}`).font = { bold: true, name: 'Calibri' };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });

  return blob;
};
//#region export_excell_factura 

interface FCF {
  exenta: number;
  gravada: number;
  iva: number;
  retencion: number;
  total: number;
}

export const export_excel_factura = async (
  factura_data: Array<Array<number | string>>,
  month: string,
  transmitter: ITransmitter,
  ticketData: Array<Array<Array<string | number>>>,
  codesArray: Array<string>
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Ventas FACT.');

  worksheet.columns = [
    { key: 'A', width: 15 },
    { key: 'B', width: 30 },
    { key: 'C', width: 30 },
    { key: 'D', width: 30 },
    { key: 'E', width: 30 },
    { key: 'F', width: 30 },
    { key: 'G', width: 30 },
    { key: 'H', width: 15 },
    { key: 'I', width: 15 },
    { key: 'J', width: 15 },
    { key: 'K', width: 15 },
    { key: 'L', width: 15 },
  ];

  const merges = [
    'A6:A8',
    'A3:B3',
    'B6:C6',
    'B7:B8',
    'C7:C8',
    'C3:J3',
    'C4:J4',
    'B5:C5',
    'D6:E6',
    'D7:D8',
    'E7:E8',
    'F6:H6',
    'F7:F8',
    'G7:H7',
    'I6:I8',
    'J6:J8',
  ];

  merges.forEach((range) => worksheet.mergeCells(range));

  const borders = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  } as ExcelJS.Borders;

  const boldText = `${transmitter.nombre}`;
  const normalText = 'ESTABLECIMIENTO: ';

  worksheet.getCell('D3').value = {
    richText: [{ text: normalText }, { text: boldText, font: { bold: true } }],
  };

  worksheet.getCell('D3').alignment = { horizontal: 'center' };
  const normalTextReg = 'REGISTRO No.';
  const boldReg = `${transmitter.nrc}`;

  worksheet.getCell('A3').value = {
    richText: [{ text: normalTextReg }, { text: boldReg, font: { bold: true } }],
  };

  const titles = [
    { cell: 'D4', text: 'LIBRO DE VENTAS CONSUMIDOR FINAL' },
    { cell: 'A5', text: `MES:${month.toUpperCase()}` },
    { cell: 'B5', text: `AÑO: ${new Date().getFullYear()}` },
  ];

  titles.forEach(({ cell, text }) => {
    worksheet.getCell(cell).value = text;
    worksheet.getCell(cell).alignment = { horizontal: 'center' };

    if (['A5', 'B5', 'B4', 'D4'].includes(cell)) {
      worksheet.getCell(cell).font = {
        bold: true,
      };
    }
  });

  worksheet.getCell('B5').alignment = { horizontal: 'center' };

  const headers_cell = [
    { cell: 'A8', text: 'FECHA EMISION' },
    { cell: 'B8', text: 'CÓDIGO DE GENERACIÓN INICIAL' },
    { cell: 'C8', text: 'CÓDIGO DE GENERACIÓN FINAL' },
    { cell: 'B6', text: 'FACTURAS' },
    { cell: 'D7', text: 'NUMERO DE CONTROL DEL' },
    { cell: 'E7', text: 'NUMERO DE CONTROL AL' },
    { cell: 'E6', text: '' },
    { cell: 'F6', text: 'VENTAS' },
    { cell: 'F8', text: 'EXENTAS' },
    { cell: 'G7', text: 'GRAVADAS' },
    { cell: 'G8', text: 'LOCALES' },
    { cell: 'H8', text: 'EXPORTACIONES' },
    { cell: 'I8', text: 'VENTAS TOTALES' },
    { cell: 'J8', text: 'VENTAS POR CUENTAS DE TERCEROS' },
  ];

  headers_cell.forEach(({ cell, text }) => {
    worksheet.getCell(cell).value = text;
    worksheet.getCell(cell).font = { name: 'Calibri', size: 9, bold: true };
    worksheet.getCell(cell).alignment = { horizontal: 'center', wrapText: true };
    worksheet.getCell(cell).border = borders;
  });

  factura_data.forEach((item, rowIndex) => {
    const row = rowIndex + 9;

    item.forEach((value, colIndex) => {
      const cell = String.fromCharCode(65 + colIndex) + row;

      worksheet.getCell(cell).value = value;
      worksheet.getCell(cell).border = borders;
      worksheet.getCell(cell).alignment = { horizontal: 'left', wrapText: true };
      worksheet.getCell(cell).font = { name: 'Calibri', size: 9 };
      if (colIndex === 1) worksheet.getCell(cell).numFmt = 'mm/dd/yyyy';
      if ([6, 7, 8, 9, 10].includes(colIndex))
        worksheet.getCell(cell).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
    });
  });

  let nextLine = factura_data.length + 9;

  worksheet.getCell(`C${nextLine}`).value = 'TOTAL';
  worksheet.getCell(`C${nextLine}`).font = {
    name: 'Calibri',
    size: 8,
    bold: true,
  };
  ['F', 'G', 'H', 'I', 'J'].forEach((col) => {
    worksheet.getCell(`${col}${nextLine}`).value = {
      formula: `SUM(${col}8:${col}${nextLine - 1})`,
      result: 0,
    };

    worksheet.getCell(`${col}${nextLine}`).font = { name: 'Calibri', bold: true, size: 8 };
    worksheet.getCell(`${col}${nextLine}`).numFmt =
      '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
  });

  const ventas_gravadas_1 = `G${nextLine}`;

  const borders_cells = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  borders_cells.forEach((cell) => {
    worksheet.getCell(`${cell}${nextLine}`).border = borders;
  });

  nextLine += 2;

  worksheet.getCell(`E${nextLine}`).value = `VENTAS LOCALES GRAVADAS`;
  worksheet.getCell(`F${nextLine}`).value = {
    formula: `+${ventas_gravadas_1}`,
  };
  worksheet.getCell(`G${nextLine}`).value = '/1.13 = VENTAS NETAS GRAVADAS';
  worksheet.getCell(`I${nextLine}`).value = {
    formula: `+${ventas_gravadas_1}/1.13`,
  };

  worksheet.getCell(`E${nextLine}`).font = { name: 'Calibri', size: 9 };
  worksheet.getCell(`F${nextLine}`).font = { name: 'Calibri', size: 9 };
  worksheet.getCell(`G${nextLine}`).font = { name: 'Calibri', size: 9 };
  worksheet.getCell(`I${nextLine}`).font = { name: 'Calibri', size: 9 };
  worksheet.getCell(`F${nextLine}`).numFmt =
    '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
  worksheet.getCell(`I${nextLine}`).numFmt =
    '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';

  const iva_13 = `I${nextLine}`;

  nextLine += 1;

  worksheet.getCell(`G${nextLine}`).value = `POR 13% IMPUESTO (DÉBITO FISCAL)`;
  worksheet.getCell(`I${nextLine}`).value = {
    formula: `+${iva_13}*0.13`,
  };

  worksheet.getCell(`G${nextLine}`).font = { name: 'Calibri', size: 9 };
  worksheet.getCell(`I${nextLine}`).font = { name: 'Calibri', size: 9 };
  worksheet.getCell(`I${nextLine}`).numFmt =
    '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';

  const iva_for_13 = `I${nextLine}`;

  const merges1 = [`G${nextLine}:H${nextLine}`];

  merges1.forEach((range) => worksheet.mergeCells(range));

  nextLine += 1;

  worksheet.getCell(`G${nextLine}`).value = `TOTAL VENTAS GRAVADAS`;
  worksheet.getCell(`I${nextLine}`).value = {
    formula: `SUM(${iva_for_13}, ${iva_13})`,
  };

  worksheet.getCell(`G${nextLine}`).font = { name: 'Calibri', size: 9 };
  worksheet.getCell(`I${nextLine}`).font = { name: 'Calibri', size: 9 };
  worksheet.getCell(`I${nextLine}`).numFmt =
    '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
  const merges2 = [`G${nextLine}:H${nextLine}`];

  merges2.forEach((range) => worksheet.mergeCells(range));

  ticketData.forEach((group, index) => {
    // Recalcular los merges_titles y newHeaders para cada grupo
    const merges_titles = [
      `A${nextLine + 2}:A${nextLine + 4}`,
      `B${nextLine + 2}:C${nextLine + 2}`,
      `B${nextLine + 3}:B${nextLine + 4}`,
      `C${nextLine + 3}:C${nextLine + 4}`,
      `D${nextLine + 2}:E${nextLine + 2}`,
      `D${nextLine + 3}:D${nextLine + 4}`,
      `E${nextLine + 3}:E${nextLine + 4}`,
      `F${nextLine + 2}:H${nextLine + 2}`,
      `F${nextLine + 3}:F${nextLine + 4}`,
      `G${nextLine + 3}:H${nextLine + 3}`,
      `I${nextLine + 2}:I${nextLine + 4}`,
      `J${nextLine + 2}:J${nextLine + 4}`,
    ];

    const newHeaders = [
      { cell: 'A' + (nextLine + 4), text: 'FECHA EMISION' },
      { cell: 'B' + (nextLine + 4), text: 'CÓDIGO DE GENERACIÓN INICIAL' },
      { cell: 'C' + (nextLine + 4), text: 'CÓDIGO DE GENERACIÓN FINAL' },
      { cell: 'B' + (nextLine + 2), text: 'PUNTO DE VENTA: ' + codesArray[index] },
      { cell: 'D' + (nextLine + 3), text: 'NUMERO DE CONTROL DEL' },
      { cell: 'E' + (nextLine + 3), text: 'NUMERO DE CONTROL AL' },
      { cell: 'E' + (nextLine + 2), text: '' },
      { cell: 'F' + (nextLine + 2), text: 'VENTAS' },
      { cell: 'F' + (nextLine + 4), text: 'EXENTAS' },
      { cell: 'G' + (nextLine + 3), text: 'GRAVADAS' },
      { cell: 'G' + (nextLine + 4), text: 'LOCALES' },
      { cell: 'H' + (nextLine + 4), text: 'EXPORTACIONES' },
      { cell: 'I' + (nextLine + 4), text: 'VENTAS TOTALES' },
      { cell: 'J' + (nextLine + 4), text: 'VENTAS POR CUENTAS DE TERCEROS' },
    ];

    // Combina las celdas y establece los encabezados
    merges_titles.forEach((range) => {
      if (!worksheet.getCell(range.split(':')[0]).isMerged) {
        worksheet.mergeCells(range);
      }
    });

    newHeaders.forEach(({ cell, text }) => {
      worksheet.getCell(cell).value = text;
      worksheet.getCell(cell).font = { name: 'Calibri', size: 9, bold: true };
      worksheet.getCell(cell).alignment = { horizontal: 'center', wrapText: true };
      worksheet.getCell(cell).border = borders;
    });

    // Agrega los datos del grupo
    group.forEach((item, rowIndex) => {
      const row = rowIndex + nextLine + 5;

      item.forEach((value, colIndex) => {
        const cell = String.fromCharCode(65 + colIndex) + row;

        worksheet.getCell(cell).value = value;
        worksheet.getCell(cell).border = borders;
        worksheet.getCell(cell).alignment = { horizontal: 'left', wrapText: true };
        worksheet.getCell(cell).font = { name: 'Calibri', size: 9 };
        if (colIndex === 1) worksheet.getCell(cell).numFmt = 'mm/dd/yyyy';
        if ([6, 7, 8, 9, 10].includes(colIndex))
          worksheet.getCell(cell).numFmt =
            '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
      });
    });

    // Agregar fila de "TOTAL"
    nextLine += group.length + 5;

    worksheet.getCell(`C${nextLine}`).value = 'TOTAL';
    worksheet.getCell(`C${nextLine}`).font = { name: 'Calibri', size: 8, bold: true };

    ['F', 'G', 'H', 'I', 'J'].forEach((col) => {
      worksheet.getCell(`${col}${nextLine}`).value = {
        formula: `SUM(${col}${nextLine - group.length}:${col}${nextLine - 1})`,
        result: 0,
      };
      worksheet.getCell(`${col}${nextLine}`).font = { name: 'Calibri', bold: true, size: 8 };
      worksheet.getCell(`${col}${nextLine}`).numFmt =
        '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
    });

    const total = `G${nextLine}`;

    // Aplicar bordes a la fila de "TOTAL"
    const borders_cells = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    borders_cells.forEach((cell) => {
      worksheet.getCell(`${cell}${nextLine}`).border = borders;
    });
    nextLine += 2;

    worksheet.getCell(`E${nextLine}`).value = `VENTAS LOCALES GRAVADAS`;
    worksheet.getCell(`F${nextLine}`).value = {
      formula: `+${total}`,
    };
    worksheet.getCell(`G${nextLine}`).value = '/1.13 = VENTAS NETAS GRAVADAS';
    worksheet.getCell(`I${nextLine}`).value = {
      formula: `+${total}/1.13`,
    };
    worksheet.getCell(`E${nextLine}`).font = { name: 'Calibri', size: 9 };
    worksheet.getCell(`F${nextLine}`).font = { name: 'Calibri', size: 9 };
    worksheet.getCell(`G${nextLine}`).font = { name: 'Calibri', size: 9 };
    worksheet.getCell(`I${nextLine}`).font = { name: 'Calibri', size: 9 };
    worksheet.getCell(`F${nextLine}`).numFmt =
      '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
    worksheet.getCell(`I${nextLine}`).numFmt =
      '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';

    const iva_13 = `I${nextLine}`;

    const merges = [`G${nextLine}:H${nextLine}`];

    merges.forEach((range) => worksheet.mergeCells(range));

    nextLine += 1;

    worksheet.getCell(`G${nextLine}`).value = `POR 13% IMPUESTO (DÉBITO FISCAL)`;
    worksheet.getCell(`I${nextLine}`).value = {
      formula: `+${iva_13}*0.13`,
    };

    worksheet.getCell(`G${nextLine}`).font = { name: 'Calibri', size: 9 };
    worksheet.getCell(`I${nextLine}`).font = { name: 'Calibri', size: 9 };
    worksheet.getCell(`I${nextLine}`).numFmt =
      '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';

    const iva_for_13 = `I${nextLine}`;

    const merges1 = [`G${nextLine}:H${nextLine}`];

    merges1.forEach((range) => worksheet.mergeCells(range));

    nextLine += 1;

    worksheet.getCell(`G${nextLine}`).value = `TOTAL VENTAS GRAVADAS`;
    worksheet.getCell(`I${nextLine}`).value = {
      formula: `SUM(${iva_for_13}, ${iva_13})`,
    };

    worksheet.getCell(`G${nextLine}`).font = { name: 'Calibri', size: 9 };
    worksheet.getCell(`I${nextLine}`).font = { name: 'Calibri', size: 9 };
    worksheet.getCell(`I${nextLine}`).numFmt =
      '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
    const merges2 = [`G${nextLine}:H${nextLine}`];

    merges2.forEach((range) => worksheet.mergeCells(range));
  });

  const finalLine = nextLine + 2;

  const merges_final = [
    `B${finalLine + 1}:C${finalLine + 1}`,
    `B${finalLine + 2}:C${finalLine + 2}`,
    `G${finalLine + 1}:I${finalLine + 1}`,
    `G${finalLine + 2}:I${finalLine + 2}`,
  ];

  worksheet.getCell(`B${finalLine + 1}`).value = '';
  worksheet.getCell(`B${finalLine + 2}`).value = 'Nombre contador o Contribuyente';
  worksheet.getCell(`B${finalLine + 1}`).font = { size: 11, name: 'Calibri' };
  worksheet.getCell(`B${finalLine + 2}`).font = { size: 11, bold: true, name: 'Calibri' };

  worksheet.getCell(`G${finalLine + 1}`).value = '______________________________________________';
  worksheet.getCell(`G${finalLine + 2}`).value = 'Firma contador o Contribuyente';
  worksheet.getCell(`G${finalLine + 1}`).font = { size: 11, name: 'Calibri' };
  worksheet.getCell(`G${finalLine + 2}`).font = { size: 11, bold: true, name: 'Calibri' };

  merges_final.forEach((range) => worksheet.mergeCells(range));

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], { type: 'application/octet-stream' });

  return blob;
};

//#region export_excell_credito


export const export_excel_credito = async (
  month: string,
  data: Array<Array<string | number>>,
  facturas: FCF,
  transmitter: ITransmitter
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Ventas CCF');

  const borders = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  } as ExcelJS.Borders;

  worksheet.columns = [
    { key: 'A', width: 5 },
    { key: 'B', width: 11.8 },
    { key: 'C', width: 30 },
    { key: 'D', width: 11.8 },
    { key: 'E', width: 11.8 },
    { key: 'F', width: 11.8 },
    { key: 'G', width: 11.8 },
    { key: 'H', width: 13 },
    { key: 'I', width: 13 },
    { key: 'J', width: 13 },
    { key: 'K', width: 13 },
    { key: 'L', width: 13 },
    { key: 'M', width: 13 },
    { key: 'N', width: 13 },
  ];

  const merges = [
    'A3:C3',
    'D3:L3',
    'D4:L4',
    'D5:E5',
    'A6:A7',
    'B6:B7',
    'C6:C7',
    'D6:D7',
    'E7:G6',
    'H6:I6',
    'J6:J7',
    'K6:K7',
    'L6:L7',
    'M6:M7',
    'N6:N7',
  ];

  merges.forEach((range) => worksheet.mergeCells(range));
  const titles = [
    { cell: 'D4', text: 'LIBRO DE COMPRAS' },
    { cell: 'A5', text: 'MES' },
    { cell: 'B5', text: `${month}` },
    { cell: 'D5', text: `AÑO: ${new Date().getFullYear()}` },
  ];

  titles.forEach(({ cell, text }) => {
    worksheet.getCell(cell).value = text;
    worksheet.getCell(cell).alignment = { horizontal: 'center', wrapText: true };

    if (['A5', 'B5', 'D5'].includes(cell)) {
      worksheet.getCell(cell).font = {
        bold: true,
      };
    }
  });

  worksheet.getCell('B5').font = { bold: true };
  worksheet.getCell('D5').font = { bold: true };
  worksheet.getCell('D4').font = { bold: true };
  worksheet.getCell('A3').value = {
    richText: [
      {
        text: 'REGISTRO No.:',
        font: {
          bold: false,
        },
      },
      {
        text: `${transmitter.nrc}}`,
        font: {
          bold: true,
        },
      },
    ],
  };
  worksheet.getCell('D3').value = {
    richText: [
      {
        text: 'ESTABLECIMIENTO:',
        font: {
          bold: false,
        },
      },
      {
        text: `${transmitter.nombre}`,
        font: {
          bold: true,
        },
      },
    ],
  };

  const headers_cell = [
    { cell: 'A7', text: 'No. Corr.' },
    { cell: 'B7', text: 'Fecha Emisión' },
    { cell: 'C7', text: 'Código de generación' },
    { cell: 'D7', text: 'No. Reg.' },
    { cell: 'E7', text: 'Nombre del Cliente' },
    { cell: 'H6', text: 'Ventas Internas' },
    { cell: 'H7', text: 'Exentas' },
    { cell: 'I7', text: 'Gravadas' },
    { cell: 'J7', text: 'IVA Débito Fiscal' },
    { cell: 'K7', text: 'Ventas a cuenta de terceros' },
    { cell: 'L7', text: 'IVA Débito Fiscal a cuenta de terceros' },
    { cell: 'M7', text: 'IVA Percibido' },
    { cell: 'N7', text: 'Total' },
  ];

  worksheet.getRow(6).height = 25;

  headers_cell.forEach(({ cell, text }) => {
    worksheet.getCell(cell).value = text;
    worksheet.getCell(cell).font = { name: 'Calibri', size: 9, bold: true };
    worksheet.getCell(cell).alignment = { horizontal: 'center', wrapText: true };
    worksheet.getCell(cell).border = borders;
  });

  data.forEach((item, rowIndex) => {
    const row = rowIndex + 8;

    item.forEach((value, colIndex) => {
      let actualColIndex = colIndex;

      if (colIndex === 4) {
        worksheet.mergeCells(`${String.fromCharCode(69)}${row}:${String.fromCharCode(71)}${row}`);
        const cell = `${String.fromCharCode(69)}${row}`;

        worksheet.getCell(cell).value = value;
        worksheet.getCell(cell).border = borders;
        worksheet.getCell(cell).alignment = { horizontal: 'left', wrapText: true };
        worksheet.getCell(cell).font = { name: 'Calibri', size: 9 };
      } else if (colIndex > 4) {
        actualColIndex = colIndex + 2;
        const cell = String.fromCharCode(65 + actualColIndex) + row;

        worksheet.getCell(cell).value = value;
        worksheet.getCell(cell).border = borders;
        worksheet.getCell(cell).alignment = { horizontal: 'left', wrapText: true };
        worksheet.getCell(cell).font = { name: 'Calibri', size: 9 };

        if ([5, 6, 7, 8, 9, 10, 11].includes(colIndex))
          worksheet.getCell(cell).numFmt =
            '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
      } else {
        const cell = String.fromCharCode(65 + colIndex) + row;

        if (colIndex === 1) worksheet.getCell(cell).numFmt = 'mm/dd/yyyy';
        worksheet.getCell(cell).value = value;
        worksheet.getCell(cell).border = borders;
        worksheet.getCell(cell).alignment = { horizontal: 'left', wrapText: true };
        worksheet.getCell(cell).font = { name: 'Calibri', size: 9 };

        if ([5, 6, 7, 8, 9, 10, 11].includes(colIndex))
          worksheet.getCell(cell).numFmt =
            '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
      }
    });
  });

  const nextLine = data.length + 8;

  worksheet.getCell(`E${nextLine}`).value = 'TOTAL';
  worksheet.getCell(`E${nextLine}`).font = {
    name: 'Calibri',
    size: 8,
    bold: true,
  };
  ['H', 'I', 'J', 'K', 'L', 'M', 'N'].forEach((col) => {
    worksheet.getCell(`${col}${nextLine}`).value = {
      formula: `SUM(${col}8:${col}${nextLine - 1})`,
      result: 0,
    };
    worksheet.getCell(`${col}${nextLine}`).font = { name: 'Calibri', bold: true, size: 8 };
    worksheet.getCell(`${col}${nextLine}`).numFmt =
      '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
  });

  const borders_cells = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

  borders_cells.forEach((cell) => {
    worksheet.getCell(`${cell}${nextLine}`).border = borders;
  });

  const columns_final = [
    `D${nextLine + 5}`,
    `F${nextLine + 5}`,
    `G${nextLine + 5}`,
    `H${nextLine + 5}`,
    `I${nextLine + 5}`,
    `J${nextLine + 5}`,
  ];

  // merges_cells.forEach((merge) => worksheet.mergeCells(merge))

  worksheet.getCell(`D${nextLine + 5}`).value = 'Ventas Exentas';
  worksheet.getCell(`F${nextLine + 5}`).value = 'Ventas Gravadas';
  worksheet.getCell(`G${nextLine + 5}`).value = 'Exportaciones';
  worksheet.getCell(`H${nextLine + 5}`).value = 'IVA';
  worksheet.getCell(`I${nextLine + 5}`).value = 'Percibido';
  worksheet.getCell(`J${nextLine + 5}`).value = 'Total';

  columns_final.forEach((col, index) => {
    worksheet.getCell(col).alignment = { horizontal: 'center', wrapText: true };
    worksheet.getCell(col).font = { size: index === 2 ? 10 : 11, name: 'Calibri' };
  });

  worksheet.getRow(nextLine + 6).height = 6;
  worksheet.getCell(`B${nextLine + 7}`).value = 'Consumidores Finales';
  worksheet.getCell(`B${nextLine + 8}`).value = 'Contribuyentes';
  worksheet.getCell(`B${nextLine + 9}`).value = 'Totales';
  worksheet.getCell(`B${nextLine + 9}`).font = { bold: true, name: 'Calibri' };

  //FCF
  worksheet.getCell(`D${nextLine + 7}`).value = facturas.exenta;
  worksheet.getCell(`F${nextLine + 7}`).value = facturas.gravada;
  worksheet.getCell(`G${nextLine + 7}`).value = 0;
  worksheet.getCell(`H${nextLine + 7}`).value = facturas.iva;
  worksheet.getCell(`I${nextLine + 7}`).value = facturas.retencion;
  worksheet.getCell(`J${nextLine + 7}`).value = facturas.total;

  worksheet.getCell(`D${nextLine + 8}`).value = { formula: `+H${nextLine}` };
  worksheet.getCell(`F${nextLine + 8}`).value = { formula: `+I${nextLine}` };
  worksheet.getCell(`G${nextLine + 8}`).value = 0;
  worksheet.getCell(`H${nextLine + 8}`).value = { formula: `+J${nextLine}` };
  worksheet.getCell(`I${nextLine + 8}`).value = { formula: `+L${nextLine}` };
  worksheet.getCell(`J${nextLine + 8}`).value = {
    formula: `SUM(D${nextLine + 8}+F${nextLine + 8}+G${nextLine + 8}+H${nextLine + 8})`,
  };

  worksheet.getCell(`D${nextLine + 9}`).value = {
    formula: `SUM(D${nextLine + 7}+D${nextLine + 8})`,
  };
  worksheet.getCell(`F${nextLine + 9}`).value = {
    formula: `SUM(F${nextLine + 7}+F${nextLine + 8})`,
  };
  worksheet.getCell(`G${nextLine + 9}`).value = {
    formula: `SUM(G${nextLine + 7}+G${nextLine + 8})`,
  };
  worksheet.getCell(`H${nextLine + 9}`).value = {
    formula: `SUM(H${nextLine + 7}+H${nextLine + 8})`,
  };
  worksheet.getCell(`I${nextLine + 9}`).value = {
    formula: `SUM(I${nextLine + 7}+I${nextLine + 8})`,
  };
  worksheet.getCell(`J${nextLine + 9}`).value = {
    formula: `SUM(D${nextLine + 9}+F${nextLine + 9}+G${nextLine + 9}+H${nextLine + 9})`,
  };

  const totals = [
    `D${nextLine + 9}`,
    `E${nextLine + 9}`,
    `F${nextLine + 9}`,
    `G${nextLine + 9}`,
    `H${nextLine + 9}`,
    `I${nextLine + 9}`,
    `J${nextLine + 9}`,
  ];

  const cell_to_format = [
    `D${nextLine + 7}`,
    `F${nextLine + 7}`,
    `G${nextLine + 7}`,
    `H${nextLine + 7}`,
    `I${nextLine + 7}`,
    `J${nextLine + 7}`,
    `D${nextLine + 8}`,
    `F${nextLine + 8}`,
    `G${nextLine + 8}`,
    `H${nextLine + 8}`,
    `I${nextLine + 8}`,
    `J${nextLine + 8}`,
    ...totals,
  ];

  totals.forEach((cell) => {
    worksheet.getCell(cell).font = { bold: true };
    worksheet.getCell(cell).border = {
      bottom: {
        style: 'double',
      },
      top: {
        style: 'thin',
      },
    };
  });

  cell_to_format.forEach((cell) => {
    worksheet.getCell(cell).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
  });

  worksheet.getCell(`D${nextLine + 14}`).value = '';
  worksheet.getCell(`D${nextLine + 15}`).value = 'Nombre contador o Contribuyente';
  worksheet.getCell(`D${nextLine + 14}`).font = { size: 9, name: 'Calibri' };
  worksheet.getCell(`D${nextLine + 15}`).font = { size: 9, bold: true, name: 'Calibri' };

  worksheet.getCell(`H${nextLine + 14}`).value = '______________________________';
  worksheet.getCell(`H${nextLine + 15}`).value = 'Firma contador o Contribuyente';
  worksheet.getCell(`H${nextLine + 14}`).font = { size: 9, name: 'Calibri' };
  worksheet.getCell(`H${nextLine + 15}`).font = { size: 9, bold: true, name: 'Calibri' };

  worksheet.mergeCells(`D${nextLine + 14}:F${nextLine + 14}`);
  worksheet.mergeCells(`D${nextLine + 15}:F${nextLine + 15}`);

  worksheet.mergeCells(`H${nextLine + 14}:I${nextLine + 14}`);
  worksheet.mergeCells(`H${nextLine + 15}:I${nextLine + 15}`);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });

  return blob;
};
//#region export_excell_facturacion

interface ExportProp {
  branch: string
  items: Array<Array<number | string>>;
  transmitter: ITransmitter;
  month: string;
  year: number
}

export const export_excel_facturacion = async (props: ExportProp) => {
  const { transmitter, month, year, items, branch } = props;

  const TypeNum = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Ventas FACT.');

  const columnWidths = [15, 30, 30, 30, 30, 30, 30, 15, 15];

  worksheet.columns = columnWidths.map((w, i) => ({ key: String.fromCharCode(65 + i), width: w }));

  const merges = ['A3:B3', 'C3:H3', 'C4:H4','C5:H5'];

  merges.forEach(range => worksheet.mergeCells(range));

  const borders = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  } as ExcelJS.Borders;

  // === 3. Cabecera con texto enriquecido ===
  worksheet.getCell('A3').value = {
    richText: [
      { text: 'REGISTRO No.' },
      { text: transmitter.nrc, font: { bold: true } },
    ],
  };

  worksheet.getCell('D3').value = {
    richText: [
      { text: transmitter.nombre, font: { bold: true } },
    ],
  };

  worksheet.getCell('D3').alignment = { horizontal: 'center' };
  worksheet.getCell('D5').value = {
    richText: [
      { text: 'Sucursal: ' },
      { text: branch, font: { bold: true } },
    ],
  };
  worksheet.getCell('D5').alignment = { horizontal: 'center' };

  const titles = [
    { cell: 'D4', text: 'LIBRO DE VENTAS CONSUMIDOR FINAL' },
    { cell: 'A5', text: `MES: ${month.toUpperCase()}` },
    { cell: 'B5', text: `AÑO: ${year}` },
  ];

  titles.forEach(({ cell, text }) => {
    const cellRef = worksheet.getCell(cell);

    cellRef.value = text;
    cellRef.font = { bold: true };
    cellRef.alignment = { horizontal: ['A5', 'B5'].includes(cell) ? 'left' : 'center' };
  });

  const headers_cell = [
    ['A6', 'FECHA'],
    ['B6', 'NUMERO DE CONTROL DEL'],
    ['C6', 'NUMERO DE CONTROL AL'],
    ['D6', 'VENTAS EXENTAS'],
    ['E6', 'GRAVADAS LOCALES'],
    ['F6', 'EXPORTACIONES'],
    ['G6', 'VENTAS TOTALES'],
    ['H6', 'VENTAS A CUENTAS DE TERCEROS'],
  ];

  headers_cell.forEach(([cell, text]) => {
    const c = worksheet.getCell(cell);

    c.value = text;
    c.font = { name: 'Calibri', size: 9, bold: true };
    c.alignment = { horizontal: 'center', wrapText: true };
    c.border = borders;
  });

  const startRow = 7;

  items.forEach((rowData, rowIndex) => {
    rowData.forEach((value, colIndex) => {
      const cell = worksheet.getCell(`${String.fromCharCode(65 + colIndex)}${startRow + rowIndex}`);

      cell.value = value;
      cell.border = borders;
      cell.font = { name: 'Calibri', size: 9 };
      cell.alignment = { horizontal: 'left', wrapText: true };

      if (colIndex === 1) cell.numFmt = 'mm/dd/yyyy';
      if ([3, 4, 5, 6, 7].includes(colIndex)) cell.numFmt = TypeNum;
    });
  });

  const totalRow = startRow + items.length;

  worksheet.getCell(`C${totalRow}`).value = 'TOTAL';
  worksheet.getCell(`C${totalRow}`).font = { name: 'Calibri', size: 8, bold: true };
  worksheet.getCell(`C${totalRow}`).border = borders;


  ['D', 'E', 'F', 'G', 'H'].forEach((col) => {
    const cell = worksheet.getCell(`${col}${totalRow}`);

    cell.value = {
      formula: `SUM(${col}${startRow}:${col}${totalRow - 1})`,
    };
    cell.font = { name: 'Calibri', size: 8, bold: true };
    cell.numFmt = TypeNum;
    cell.border = borders;
  });

  const fiscalRow = totalRow + 3;

  worksheet.getCell(`D${fiscalRow}`).value = 'VENTAS LOCALES GRAVADAS';
  worksheet.getCell(`E${fiscalRow}`).value = { formula: `E${totalRow}` };
  worksheet.getCell(`E${fiscalRow}`).numFmt = TypeNum;

  worksheet.getCell(`F${fiscalRow}`).value = '/1.13 = VENTAS NETAS GRAVADAS';
  worksheet.getCell(`F${fiscalRow + 1}`).value = 'POR 13% IMPUESTO (DEBITO FISCAL)';
  worksheet.getCell(`F${fiscalRow + 2}`).value = 'TOTAL VENTAS GRAVADAS';

  worksheet.getCell(`H${fiscalRow}`).value = { formula: `E${totalRow}/1.13` };
  worksheet.getCell(`H${fiscalRow + 1}`).value = { formula: `H${fiscalRow}*13%` };
  worksheet.getCell(`H${fiscalRow + 2}`).value = { formula: `H${fiscalRow}+H${fiscalRow + 1}` };
  ['H' + fiscalRow, 'H' + (fiscalRow + 1), 'H' + (fiscalRow + 2)].forEach((cellRef) => {
    const c = worksheet.getCell(cellRef);

    c.numFmt = TypeNum;
  });
  worksheet.getCell(`H${fiscalRow + 1}`).border = { bottom: { style: 'thin' } };

  const merges_final = [
    `B${fiscalRow}:C${fiscalRow}`,
    `F${fiscalRow}:G${fiscalRow}`,
    `F${fiscalRow + 1}:G${fiscalRow + 1}`,
    `F${fiscalRow + 2}:G${fiscalRow + 2}`,
    `B${fiscalRow + 8}:C${fiscalRow + 8}`,
    `B${fiscalRow + 9}:C${fiscalRow + 9}`,
    `G${fiscalRow + 8}:I${fiscalRow + 8}`,
    `G${fiscalRow + 9}:I${fiscalRow + 9}`,
  ];

  merges_final.forEach(range => worksheet.mergeCells(range));

  const buffer = await workbook.xlsx.writeBuffer();

  return new Blob([buffer], { type: 'application/octet-stream' });
};

//#region export_excell_facturacion_ccfe 

interface Ccfe {
  name: string;
  sales: Array<Array<string | number>>;
  totals: FCF;
}

interface ExportPropCcfe {
  items: Ccfe[];
  transmitter: ITransmitter;
  month: string;
  branch: string;
  yeatSelected: number;
}

export const export_excel_facturacion_ccfe = async ({
  items,
  transmitter,
  month,
  branch,
  yeatSelected,
}: ExportPropCcfe) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Ventas CCFE');
  let nextLine = 7;

  const borders = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  } as ExcelJS.Borders;

  worksheet.columns = [
    { key: 'A', width: 7 },
    { key: 'B', width: 11.8 },
    { key: 'C', width: 30 },
    { key: 'D', width: 30 },
    { key: 'E', width: 30 },
    { key: 'F', width: 11.8 },
    { key: 'G', width: 11.8 },
    { key: 'H', width: 11.8 },
    { key: 'I', width: 11.8 },
    { key: 'J', width: 13 },
    { key: 'K', width: 13 },
    { key: 'L', width: 13 },
    { key: 'M', width: 13 },
    { key: 'N', width: 13 },
    { key: 'O', width: 13 },
    { key: 'P', width: 13 },
  ];

  const extraInfo = [
    [`REGISTRO No.: ${transmitter.nrc}`],
    [`MES: ${month}`, ` AÑO: ${yeatSelected}`],
  ];

  const extraHeaderInfo = [
    {
      values: [`ESTABLECIMIENTO: ${transmitter.nombre}`],
      alignment: ['center'],
    },
    {
      values: ['LIBRO DE VENTAS DE CRÉDITO FISCAL'],
      alignment: ['center'],
    },
    {
      values: [`SUCURSAL: ${branch}`],
      alignment: ['center'],
    },
  ];

  const boldAfterColon = (text: string): ExcelJS.CellRichTextValue => {
    const parts = text.split(':');

    if (parts.length === 2) {
      return {
        richText: [
          { text: `${parts[0]}:`, font: { bold: false } },
          { text: ` ${parts[1]}`, font: { bold: true } },
        ],
      };
    } else {
      return {
        richText: [{ text, font: { bold: true } }],
      };
    }
  };

  extraHeaderInfo.forEach(({ values, alignment }) => {
    const row = worksheet.addRow(['']);
    const rowIndex = row.number;

    values.forEach((val, i) => {
      const cell = worksheet.getCell(rowIndex, i + 1);
      const alignmentValue = alignment?.[i] ?? 'left';

      cell.value = boldAfterColon(val);
      cell.alignment = {
        horizontal: alignmentValue as ExcelJS.Alignment['horizontal'],
        wrapText: true,
      };
    });

    worksheet.mergeCells(`A${rowIndex}:P${rowIndex}`);
  });

  extraInfo.forEach((rowTexts, idx) => {
    const row = worksheet.addRow(new Array(rowTexts.length).fill(''));
    const rowIndex = row.number;

    if (idx === 0) {
      const cell = worksheet.getCell(`A${rowIndex}`);

      cell.value = boldAfterColon(rowTexts[0]);
      cell.alignment = { horizontal: 'left' };
      worksheet.mergeCells(`A${rowIndex}:C${rowIndex}`);
    }

    if (idx === 1) {
      const mesCell = worksheet.getCell(`A${rowIndex}`);

      mesCell.value = boldAfterColon(rowTexts[0]);
      mesCell.alignment = { horizontal: 'left' };
      worksheet.mergeCells(`A${rowIndex}:B${rowIndex}`);

      const yearCell = worksheet.getCell(`C${rowIndex}`);

      yearCell.value = boldAfterColon(rowTexts[1]);
      yearCell.alignment = { horizontal: 'left' };
    }
  });


  worksheet.addRow([]);

  items.forEach(({ name, sales, totals }) => {
    worksheet.getCell(`A${nextLine}`).value = name;
    worksheet.getCell(`A${nextLine}`).font = {
      bold: true,
      size: 10,
    };

    const base = nextLine;

    const merges = [
      `A${base}:C${base}`,
      ...['A', 'B', 'C', 'D', 'E', 'F', 'L', 'M', 'N', 'O', 'P'].map(col => `${col}${base + 2}:${col}${base + 3}`),
      `G${base + 3}:I${base + 2}`,
      `J${base + 2}:K${base + 2}`,
    ];

    merges.forEach((range) => worksheet.mergeCells(range));

    worksheet.getRow(nextLine + 2).height = 25;

    const headers_cell = [
      { cell: `A${nextLine + 3}`, text: 'No. Corr.' },
      { cell: `B${nextLine + 3}`, text: 'Fecha Emisión' },
      { cell: `C${nextLine + 3}`, text: 'Código de generación' },
      { cell: `D${nextLine + 3}`, text: 'Numero de control' },
      { cell: `E${nextLine + 3}`, text: 'Sello recibido' },
      { cell: `F${nextLine + 3}`, text: 'No. reg' },
      { cell: `G${nextLine + 3}`, text: 'Nombre del cliente' },
      { cell: `J${nextLine + 2}`, text: 'Ventas Internas' },
      { cell: `J${nextLine + 3}`, text: 'Exentas' },
      { cell: `K${nextLine + 3}`, text: 'Gravadas' },
      { cell: `L${nextLine + 3}`, text: 'IVA Débito Fiscal' },
      { cell: `M${nextLine + 3}`, text: 'Ventas a cuenta de terceros' },
      { cell: `N${nextLine + 3}`, text: 'IVA Débito Fiscal a cuenta de terceros' },
      { cell: `O${nextLine + 3}`, text: 'IVA Percibido' },
      { cell: `P${nextLine + 3}`, text: 'Total' },
    ];

    headers_cell.forEach(({ cell, text }) => {
      worksheet.getCell(cell).value = text;
      worksheet.getCell(cell).font = { name: 'Calibri', size: 9, bold: true };
      worksheet.getCell(cell).alignment = { horizontal: 'center', wrapText: true };
      worksheet.getCell(cell).border = borders;
    });

    sales.forEach((item, rowIndex) => {
      const row = rowIndex + nextLine + 4;

      item.forEach((value, colIndex) => {
        let actualColIndex = colIndex;

        if (colIndex === 6) {
          worksheet.mergeCells(`${String.fromCharCode(71)}${row}:${String.fromCharCode(73)}${row}`);
          const cell = `${String.fromCharCode(71)}${row}`;

          worksheet.getCell(cell).value = value;
          worksheet.getCell(cell).border = borders;
          worksheet.getCell(cell).alignment = { horizontal: 'left', wrapText: true };
          worksheet.getCell(cell).font = { name: 'Calibri', size: 9 };
        } else if (colIndex > 6) {
          actualColIndex = colIndex + 2;
          const cell = String.fromCharCode(65 + actualColIndex) + row;

          worksheet.getCell(cell).value = value;
          worksheet.getCell(cell).border = borders;
          worksheet.getCell(cell).alignment = { horizontal: 'left', wrapText: true };
          worksheet.getCell(cell).font = { name: 'Calibri', size: 9 };

          if ([7, 8, 9, 10, 11, 12, 13].includes(colIndex))
            worksheet.getCell(cell).numFmt =
              '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
        } else {
          const cell = String.fromCharCode(65 + colIndex) + row;

          if (colIndex === 1) worksheet.getCell(cell).numFmt = 'mm/dd/yyyy';
          worksheet.getCell(cell).value = value;
          worksheet.getCell(cell).border = borders;
          worksheet.getCell(cell).alignment = { horizontal: 'left', wrapText: true };
          worksheet.getCell(cell).font = { name: 'Calibri', size: 9 };

          if ([7, 8, 9, 10, 11, 12, 13].includes(colIndex))
            worksheet.getCell(cell).numFmt =
              '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
        }
      });
    });

    nextLine += sales.length + 4;

    worksheet.getCell(`E${nextLine}`).value = 'TOTAL';
    worksheet.getCell(`E${nextLine}`).font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };

    ['J', 'K', 'L', 'M', 'N', 'O', 'P'].forEach((col) => {
      worksheet.getCell(`${col}${nextLine}`).value = {
        formula: `SUM(${col}${nextLine - sales.length}:${col}${nextLine - 1})`,
      };
      worksheet.getCell(`${col}${nextLine}`).font = { name: 'Calibri', bold: true, size: 8 };
      worksheet.getCell(`${col}${nextLine}`).numFmt =
        '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
    });

    const borders_cells = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',];

    borders_cells.forEach((cell) => {
      worksheet.getCell(`${cell}${nextLine}`).border = borders;
    });

    const columns_final = [
      `D${nextLine + 5}`,
      `F${nextLine + 5}`,
      `G${nextLine + 5}`,
      `H${nextLine + 5}`,
      `I${nextLine + 5}`,
      `J${nextLine + 5}`,
    ];

    worksheet.getCell(`D${nextLine + 5}`).value = 'Ventas Exentas';
    worksheet.getCell(`F${nextLine + 5}`).value = 'Ventas Gravadas';
    worksheet.getCell(`G${nextLine + 5}`).value = 'Exportaciones';
    worksheet.getCell(`H${nextLine + 5}`).value = 'IVA';
    worksheet.getCell(`I${nextLine + 5}`).value = 'Percibido';
    worksheet.getCell(`J${nextLine + 5}`).value = 'Total';

    columns_final.forEach((col, index) => {
      worksheet.getCell(col).alignment = { horizontal: 'center', wrapText: true };
      worksheet.getCell(col).font = { size: index === 2 ? 10 : 11, name: 'Calibri' };
    });

    worksheet.getCell(`B${nextLine + 7}`).value = 'Consumidores Finales';
    worksheet.getCell(`B${nextLine + 8}`).value = 'Contribuyentes';
    worksheet.getCell(`B${nextLine + 9}`).value = 'Totales';
    worksheet.getCell(`B${nextLine + 9}`).font = { bold: true, name: 'Calibri' };

    //FCF
    worksheet.getCell(`D${nextLine + 7}`).value = totals.exenta;
    worksheet.getCell(`F${nextLine + 7}`).value = totals.gravada;
    worksheet.getCell(`G${nextLine + 7}`).value = 0;
    worksheet.getCell(`H${nextLine + 7}`).value = totals.iva;
    worksheet.getCell(`I${nextLine + 7}`).value = totals.retencion;
    worksheet.getCell(`J${nextLine + 7}`).value = totals.total;

    worksheet.getCell(`D${nextLine + 8}`).value = { formula: `+J${nextLine}` };
    worksheet.getCell(`F${nextLine + 8}`).value = { formula: `+K${nextLine}` };
    worksheet.getCell(`G${nextLine + 8}`).value = 0;
    worksheet.getCell(`H${nextLine + 8}`).value = { formula: `+L${nextLine}` };
    worksheet.getCell(`I${nextLine + 8}`).value = { formula: `+M${nextLine}` };
    worksheet.getCell(`J${nextLine + 8}`).value = {
      formula: `SUM(D${nextLine + 8}+F${nextLine + 8}+G${nextLine + 8}+H${nextLine + 8})`,
    };

    worksheet.getCell(`D${nextLine + 9}`).value = {
      formula: `SUM(D${nextLine + 7}+D${nextLine + 8})`,
    };
    worksheet.getCell(`F${nextLine + 9}`).value = {
      formula: `SUM(F${nextLine + 7}+F${nextLine + 8})`,
    };
    worksheet.getCell(`G${nextLine + 9}`).value = {
      formula: `SUM(G${nextLine + 7}+G${nextLine + 8})`,
    };
    worksheet.getCell(`H${nextLine + 9}`).value = {
      formula: `SUM(H${nextLine + 7}+H${nextLine + 8})`,
    };
    worksheet.getCell(`I${nextLine + 9}`).value = {
      formula: `SUM(I${nextLine + 7}+I${nextLine + 8})`,
    };
    worksheet.getCell(`J${nextLine + 9}`).value = {
      formula: `SUM(D${nextLine + 9}+F${nextLine + 9}+G${nextLine + 9}+H${nextLine + 9})`,
    };

    const totals_fields = [`D${nextLine + 9}`, `E${nextLine + 9}`, `F${nextLine + 9}`, `G${nextLine + 9}`, `H${nextLine + 9}`, `I${nextLine + 9}`, `J${nextLine + 9}`,];

    const cell_to_format = [
      `D${nextLine + 7}`,
      `F${nextLine + 7}`,
      `G${nextLine + 7}`,
      `H${nextLine + 7}`,
      `I${nextLine + 7}`,
      `J${nextLine + 7}`,
      `D${nextLine + 8}`,
      `F${nextLine + 8}`,
      `G${nextLine + 8}`,
      `H${nextLine + 8}`,
      `I${nextLine + 8}`,
      `J${nextLine + 8}`,
      ...totals_fields,
    ];

    totals_fields.forEach((cell) => {
      worksheet.getCell(cell).font = { bold: true };
      worksheet.getCell(cell).border = {
        bottom: {
          style: 'double',
        },
        top: {
          style: 'thin',
        },
      };
    });

    cell_to_format.forEach((cell) => {
      worksheet.getCell(cell).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
    });
    nextLine += 12;
  });

  nextLine += 6;

  worksheet.getCell(`D${nextLine + 2}`).border = { bottom: { style: 'thin' } };
  worksheet.getCell(`D${nextLine + 3}`).value = 'Nombre contador o Contribuyente';
  worksheet.getCell(`D${nextLine + 2}`).font = { size: 9, name: 'Calibri' };
  worksheet.getCell(`D${nextLine + 3}`).font = { size: 9, bold: true, name: 'Calibri' };

  worksheet.getCell(`H${nextLine + 2}`).border = { bottom: { style: 'thin' } };
  worksheet.getCell(`H${nextLine + 3}`).value = 'Firma contador o Contribuyente';
  worksheet.getCell(`H${nextLine + 2}`).font = { size: 9, name: 'Calibri' };
  worksheet.getCell(`H${nextLine + 3}`).font = { size: 9, bold: true, name: 'Calibri' };

  worksheet.mergeCells(`D${nextLine + 2}:F${nextLine + 2}`);
  worksheet.mergeCells(`D${nextLine + 3}:F${nextLine + 3}`);

  worksheet.mergeCells(`H${nextLine + 2}:I${nextLine + 2}`);
  worksheet.mergeCells(`H${nextLine + 3}:I${nextLine + 3}`);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });

  return blob;
};
