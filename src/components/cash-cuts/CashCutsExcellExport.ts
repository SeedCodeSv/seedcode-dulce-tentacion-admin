import ExcelJS from 'exceljs';

import { DataBox } from "@/types/cashCuts.types";
import { Branches } from "@/types/branches.types";
import { ITransmitter } from '@/types/transmitter.types';
import { formatCurrency } from '@/utils/dte';

interface PropsCashCut {
    branch: Branches | undefined
    params: {
        startDate: string,
        endDate: string,
    }
    totalGeneral: number
    data: DataBox
    transmitter: ITransmitter
}

export const exportToExcel = async ({ branch, params, data, transmitter }: PropsCashCut) => {
   const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Corte');

  const infoHeader = [
    transmitter.nombre,
    transmitter.nombreComercial,
    branch?.name ?? '',
    `Fecha: ${params.startDate}`,
  ];

  infoHeader.forEach((text) => {
    const rowIndex = worksheet.rowCount + 1;

    worksheet.mergeCells(`A${rowIndex}:G${rowIndex}`);
    const row = worksheet.getRow(rowIndex);

    row.getCell(1).value = text;
    row.font = { bold: true };
    row.alignment = { vertical: 'middle', horizontal: 'center' };
    row.commit();
  });

  worksheet.addRow([]);

  // Tabla de ventas por tipo de documento
  worksheet.addRow([
    'Descripción',
    'N° Inicial',
    'N° Final',
    'Gravadas',
    'No sujetas',
    'Exentas',
    'Total',
  ]).font = { bold: true };

  const ventasRows = [
    {
      descripcion: 'Factura consumidor final',
      inicial: data?.firtsSale ?? '',
      final: data?.lastSale ?? '',
      gravadas: formatCurrency((data.totalSales01Card || 0) + (data.totalSales01Cash || 0)),
      noSujetas: formatCurrency(0),
      exentas: formatCurrency(0),
      total: formatCurrency((data.totalSales01Card || 0) + (data.totalSales01Cash || 0)),
    },
    {
      descripcion: 'Crédito fiscal',
      inicial: data?.firtsSale03 ?? '',
      final: data?.lastSale03 ?? '',
      gravadas: formatCurrency((data.totalSales03Card || 0) + (data.totalSales03Cash || 0)),
      noSujetas: formatCurrency(0),
      exentas: formatCurrency(0),
      total: formatCurrency((data.totalSales03Card || 0) + (data.totalSales03Cash || 0)),
    },
    {
      descripcion: 'Anulaciones factura consumidor',
      inicial: data?.firstInvalidation01 ?? '',
      final: data.lastInvalidation01 ?? '',
      gravadas: formatCurrency(0),
      noSujetas: formatCurrency(0),
      exentas: formatCurrency(0),
      total: formatCurrency(Number(data.invalidation01 ?? 0)),
    },
    {
      descripcion: 'Anulaciones crédito fiscal',
      inicial: data.firstInvalidation03 ?? '',
      final: data.lastInvalidation03 ?? '',
      gravadas: formatCurrency(0),
      noSujetas: formatCurrency(0),
      exentas: formatCurrency(0),
      total: formatCurrency(Number(data.invalidation03 ?? 0)),
    },
  ];

  ventasRows.forEach((row) => {
    worksheet.addRow([
      row.descripcion,
      row.inicial,
      row.final,
      row.gravadas,
      row.noSujetas,
      row.exentas,
      row.total,
    ]);
  });

  worksheet.addRow([
  'TOTAL GENERAL',
  '',        
  '',         
  '',         
  '',        
  '',        
  formatCurrency(
    [
      data.totalSales01Card,
      data.totalSales03Card,
      data.totalSales01Cash,
      data.totalSales03Cash,
    ].reduce((acc: number, val) => acc + (Number(val) || 0), 0)
  ),
]).font = { bold: true };


  worksheet.addRow([]); // Espacio

const startRow = worksheet.rowCount + 2;

worksheet.getCell(`A${startRow}`).value = 'Totales Generales';
worksheet.getCell(`A${startRow}`).font = { bold: true };

worksheet.getCell(`D${startRow}`).value = 'Formas de pago';
worksheet.getCell(`D${startRow}`).font = { bold: true };

// Contenido: 3 filas lado a lado
const rows = [
  [
    'Monto inicial caja', formatCurrency(data.box.start ?? 0),
    '',
    'Efectivo', formatCurrency(data.totalSales01Cash),
  ],
  [
    'Gastos', formatCurrency(0),
    '',
    'Tarjeta', formatCurrency(data.totalSales01Card),
  ],
];

rows.forEach((rowData) => {
  worksheet.addRow(rowData);
});


  // Ajuste de columnas
  worksheet.columns = [
    { width: 35 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
  ];

    const buffer = await workbook.xlsx.writeBuffer();

    return new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
};
