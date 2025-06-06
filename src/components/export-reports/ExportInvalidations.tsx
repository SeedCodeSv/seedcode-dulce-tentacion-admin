import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver';

import { Innvalidation } from '@/types/Innvalidations.types';
import { TypesVentas } from '@/utils/utils';

function ValuesData(val: string) {
    const typeDte = TypesVentas.find((item) => item.value === val)

    return typeDte?.label ?? ''
}

export async function exportInvalidationsToExcel(
    data: Innvalidation[],
    startDate: string,
    endDate: string
) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invalidaciones');

    worksheet.columns = [
        { header: 'Fecha', key: 'fecAnula1', width: 15 },
        { header: 'Código Generación', key: 'codigoGeneracion', width: 40 },
        { header: 'Número Control', key: 'numeroControl', width: 40 },
        { header: 'Fecha Anulación', key: 'fecAnula', width: 15 },
        { header: 'Hora Anulación', key: 'horAnula', width: 15 },
        { header: 'Responsable', key: 'nombreResponsable', width: 30 },
        { header: 'Doc Responsable', key: 'numDocumentoResponsable', width: 20 },
        { header: 'Solicitante', key: 'nombreSolicita', width: 25 },
        { header: 'Doc Solicitante', key: 'numDocumentoSolicita', width: 20 },
        { header: 'Tipo DTE', key: 'tipoDte', width: 35 },
        { header: 'Tipo Anulación', key: 'tipoAnulacion', width: 15 },
        { header: 'Total Gravada', key: 'totalGravada', width: 15 },
        { header: 'Total Pagar', key: 'totalPagar', width: 15 },
    ];

    const lastCol = worksheet.getColumn(worksheet.columns.length).letter;

    worksheet.mergeCells(`A1:${lastCol}1`);
    const titleCell = worksheet.getCell('A1');

    titleCell.value = 'Reporte de Invalidaciones';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4682B4' },
    };

    worksheet.mergeCells(`A2:${lastCol}2`);
    const subtitleCell = worksheet.getCell('A2');

    subtitleCell.value = `Desde el ${startDate} hasta el ${endDate}`;
    subtitleCell.font = { italic: true, color: { argb: 'FFFFFFFF' } };
    subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    subtitleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4682B4' },
    };

    worksheet.insertRow(3, worksheet.columns.map((col) => col.header));
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

    data.forEach((inv) => {
        worksheet.insertRow(rowIndex++, {
            fecAnula1: inv.fecAnula,
            codigoGeneracion: inv.codigoGeneracion,
            numeroControl: inv.numeroControl,
            fecAnula: inv.fecAnula,
            horAnula: inv.horAnula,
            nombreResponsable: inv.nombreResponsable,
            numDocumentoResponsable: inv.numDocumentoResponsable,
            nombreSolicita: inv.nombreSolicita,
            numDocumentoSolicita: inv.numDocumentoSolicita,
            tipoDte: ValuesData(inv.tipoDte),
            tipoAnulacion: typeof inv.tipoAnulacion === 'string' ? inv.tipoAnulacion : 'N/D',
            totalGravada: Number(inv.sale?.totalGravada) || Number(inv.notaRemision?.totalGravada) || Number('0.00'),
            totalPagar: Number(inv.sale?.totalPagar) || Number(inv.notaRemision?.totalPagar) || Number('0.00'),
        });
    });

    const currencyCols = ['L', 'M'];

    currencyCols.forEach((col) => {
        worksheet.getColumn(col).numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
    });

    const totalRowNumber = worksheet.rowCount + 1;

    const totalRow = worksheet.addRow([
        'TOTAL GENERAL:', '', '', '', '', '', '', '', '', '', '',
        { formula: `SUBTOTAL(9,L4:L${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,M4:M${totalRowNumber - 1})` },
    ]);

    const moneyColumns = [12, 13]; // columnas L y M

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
    const today = new Date().toISOString().slice(0, 10);

    saveAs(new Blob([buffer]), `Invalidaciones_${today}.xlsx`);
}
