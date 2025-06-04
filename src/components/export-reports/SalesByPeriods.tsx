import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { SaleDetailsReport } from './types/sales_by_periods.types';

export async function exportSalesExcel(sales: SaleDetailsReport[], startDate: string, endDate: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');

    worksheet.columns = [
        { header: 'Fecha', key: 'fecEmi', width: 20 },
        { header: 'Número Control', key: 'numeroControl', width: 35 },
        { header: 'Monto Total', key: 'montoTotal', width: 30 },
        { header: 'Sucursal', key: 'branch', width: 30 },
    ];
    const lastColLetter = worksheet.getColumn(worksheet.columns.length).letter;

    // TITULO
    worksheet.mergeCells(`A1:${lastColLetter}1`);
    const titleCell = worksheet.getCell('A1');

    titleCell.value = 'Ventas por Periodos';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4682B4' },
    };

    // SUBTITULO
    worksheet.mergeCells(`A2:${lastColLetter}2`);
    const subtitleCell = worksheet.getCell('A2');

    subtitleCell.value = `Desde el ${startDate} hasta el ${endDate}`;
    subtitleCell.font = { italic: true, color: { argb: 'FFFFFFFF' } };
    subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    subtitleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4682B4' },
    };

    // 🔁 INSERCIÓN DE ENCABEZADOS ANTES DE LOS DATOS
    worksheet.insertRow(3, worksheet.columns.map(col => col.header));
    const headerRow = worksheet.getRow(3);

    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4682B4' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.autoFilter = {
        from: { row: 3, column: 1 },
        to: { row: 3, column: worksheet.columns.length },
    };

    // 👇 Insertar datos DESPUÉS de encabezado
    let rowIndex = 4;
    
    sales.forEach((sale) => {


        worksheet.insertRow(rowIndex++, {
            fecEmi: sale.fecEmi,
            numeroControl: sale.numeroControl,
            montoTotal: sale.montoTotal,
            branch: sale.branch,
        });
    });

    worksheet.getColumn('C').numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';

    // FILA DE TOTAL
    const totalRowNumber = worksheet.rowCount + 1;
    const totalRow = worksheet.addRow([
        'Total General:',
        '',
        { formula: `SUBTOTAL(9,C4:C${totalRowNumber - 1})` },
        '',
    ]);



    totalRow.eachCell((cell, colNumber) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4682B4' },
        };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };

        if (colNumber === 3) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
        }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const date = new Date().toISOString().slice(0, 10);

    saveAs(new Blob([buffer]), `Ventas_Por_Periodos_${date}.xlsx`);
}


