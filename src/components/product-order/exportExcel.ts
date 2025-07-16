import ExcelJS from 'exceljs';
import { toast } from 'sonner';

import { IOrderProduct } from './exportPdf';

import { getElSalvadorDateTimeText } from '@/utils/dates';
import { ITransmitter } from '@/types/transmitter.types';

export const exportToExcelOrderProduct = async (data: IOrderProduct[], startDate: string, endDate: string, transmitter: ITransmitter) => {
  try {
    const workbook = new ExcelJS.Workbook();

    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Ordenes de producto');

    worksheet.addRow([]);

    const keys = data.length > 0 ? Object.keys(data[0]) : [];
    const headers = keys.map(key => {
      if (key.toLowerCase() === 'producto') return 'Nombre del Producto';

      return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    });

    const extraInfo = [
      [`${transmitter.nombreComercial}`],
      [`Fecha: ${getElSalvadorDateTimeText().fecEmi}`],
      [`Reporte desde ${startDate} hasta ${endDate}`],
    ];

    extraInfo.forEach((row, index) => {
      const newRow = worksheet.addRow(row);
      const lastColLetter = worksheet.getColumn(headers.length).letter;

      worksheet.mergeCells(`A${newRow.number}:${lastColLetter}${newRow.number}`);
      newRow.font = { bold: index === 0, size: 13 };
      newRow.alignment = { horizontal: 'center' };
    });

    worksheet.addRow([]);

    worksheet.columns = headers.map(h => ({
      width: h === 'Nombre del Producto' ? 40 : 25,
    }));

    const headerRow = worksheet.addRow(headers);


    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF71A3' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    data.forEach((item) => {
      const rowData = keys.map((key) => item[key] ?? 0);
      const row = worksheet.addRow(rowData);

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (colNumber > 1) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `Ordenes_de_Producto_${startDate}_a_${endDate}.xlsx`;
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 100);
  } catch (error) {
    toast.error('Error al generar el archivo Excel.');
  }
};
