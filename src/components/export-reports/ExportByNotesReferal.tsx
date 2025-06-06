import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { IExportNote } from '@/types/referal-note.types';

export async function exportNotesReferal(sales: IExportNote[], startDate: string, endDate: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');

    worksheet.columns = [
        { header: 'Fecha', key: 'fecEmi', width: 15 },
        { header: 'Hora', key: 'horEmi', width: 10 },
        { header: 'Número de Control', key: 'controlNumber', width: 35 },
        { header: 'Total No Sujeto', key: 'totalNoSuj', width: 20 },
        { header: 'Total Exenta', key: 'totalExenta', width: 20 },
        { header: 'Total Gravada', key: 'totalGravada', width: 20 },
        { header: 'Subtotal Ventas', key: 'subTotalVentas', width: 20 },
        { header: 'Desc. No Suj', key: 'descuNoSuj', width: 20 },
        { header: 'Desc. Exenta', key: 'descuExenta', width: 20 },
        { header: 'Desc. Gravada', key: 'descuGravada', width: 20 },
        { header: '% Descuento', key: 'porcentajeDescuento', width: 20 },
        { header: 'Total Descuento', key: 'totalDescu', width: 20 },
        { header: 'Subtotal', key: 'subTotal', width: 20 },
        { header: 'Monto Total Op.', key: 'montoTotalOperacion', width: 20 },
        { header: 'Total a Pagar', key: 'totalPagar', width: 20 },
        { header: 'Total en Letras', key: 'totalLetras', width: 35 },
        { header: 'Código Punto de Venta', key: 'codePOS', width: 20 },
        { header: 'Tipo Comprobante', key: 'typeVoucher', width: 20 },
        { header: 'Observaciones', key: 'observation', width: 30 },
        { header: 'Estado', key: 'status', width: 30 },
        { header: 'Sucursal Emisora', key: 'branch', width: 30 },
        { header: 'Sucursal Receptora', key: 'receivingBranchName', width: 30 },
    ];

    const lastColLetter = worksheet.getColumn(worksheet.columns.length).letter;

    worksheet.mergeCells(`A1:${lastColLetter}1`);
    const titleCell = worksheet.getCell('A1');

    titleCell.value = 'Notas de remision';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4682B4' },
    };

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

    let rowIndex = 4;



    sales.forEach((saleData) => {
        worksheet.insertRow(rowIndex++, {
            fecEmi: saleData.fecEmi,
            horEmi: saleData.horEmi,
            controlNumber: saleData.numeroControl || 'N/A',
            totalNoSuj: Number(saleData.totalNoSuj),
            totalExenta: Number(saleData.totalExenta),
            totalGravada: Number(saleData.totalGravada),
            subTotalVentas: Number(saleData.subTotalVentas),
            descuNoSuj: Number(saleData.descuNoSuj),
            descuExenta: Number(saleData.descuExenta),
            descuGravada: Number(saleData.descuGravada),
            porcentajeDescuento: Number(saleData.porcentajeDescuento),
            totalDescu: Number(saleData.totalDescu),
            subTotal: Number(saleData.subTotal),
            // totalIva: 0, 
            montoTotalOperacion: Number(saleData.montoTotalOperacion),
            totalPagar: Number(saleData.totalPagar),
            totalLetras: saleData.totalLetras,
            codePOS: 'N/A', // Solo si hay info adicional del punto de venta
            typeVoucher: saleData.tipoDte || 'N/A',
            observation: saleData.observaciones || 'N/A',
            status: saleData.status.name || 'N/A',
            branch: saleData.branch?.name || 'N/A',
            receivingBranchName: saleData.receivingBranchName || 'N/A',
        });
    });

    ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
        .forEach((col) => {
            worksheet.getColumn(col).numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
        });


    const totalRowNumber = worksheet.rowCount + 1;

    const totalRow = worksheet.addRow([
        'Total General:',
        '',
        '',
        { formula: `SUBTOTAL(9,D4:D${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,E4:E${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,F4:F${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,G4:G${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,H4:H${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,I4:I${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,J4:J${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,K4:K${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,L4:L${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,M4:M${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,N4:N${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,O4:O${totalRowNumber - 1})` },
        '',
        '', '', '', '', '', ''
    ]);

    const moneyColumns = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    totalRow.eachCell((cell, colNumber) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4682B4' },
        };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };

        if (moneyColumns.includes(colNumber)) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
        }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const date = new Date().toISOString().slice(0, 10);

    saveAs(new Blob([buffer]), `Notas_de_remision-${date}.xlsx`);
}
